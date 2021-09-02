package postgres

import (
	"github.com/chrsep/vor/pkg/domain"
	cSchool "github.com/chrsep/vor/pkg/school"
	"github.com/go-pg/pg/v10"
	"github.com/google/uuid"
	richErrors "github.com/pkg/errors"
	"mime/multipart"
	"time"
)

type SchoolStore struct {
	*pg.DB
	FileStorage  FileStorage
	ImageStorage ImageStorage
}

func (s SchoolStore) NewProgressReport(
	schoolId string,
	title string,
	start time.Time,
	end time.Time,
	customStudents []string,
) error {
	var students = make([]Student, 0)
	model := s.Model(&students).
		Where("school_id = ? and active", &schoolId).
		Column("id")

	if customStudents != nil {
		model = model.Where("id in (?)", pg.In(customStudents))
	}
	if err := model.Select(); err != nil {
		return richErrors.Wrap(err, "failed to find students")
	}

	report := ProgressReport{
		Id:          uuid.New(),
		SchoolId:    schoolId,
		Title:       title,
		PeriodStart: start,
		PeriodEnd:   end,
	}

	studentReports := make([]StudentReport, len(students))
	for i, student := range students {
		studentReports[i] = StudentReport{
			StudentId:        uuid.MustParse(student.Id),
			ProgressReportId: report.Id,
		}
	}

	if err := s.RunInTransaction(s.Context(), func(tx *pg.Tx) error {
		if _, err := s.Model(&report).
			Insert(); err != nil {
			return richErrors.Wrap(err, "fail(db): insert progress report")
		}

		if len(studentReports) > 0 {
			if _, err := s.Model(&studentReports).
				Insert(); err != nil {
				return richErrors.Wrap(err, "fail(db): insert student reports")
			}
		}

		return nil
	}); err != nil {
		return err
	}

	return nil
}

func (s SchoolStore) UpdateSchool(schoolId string, name *string) error {
	updateQuery := PartialUpdateModel{}
	updateQuery.AddStringColumn("name", name)

	if _, err := s.Model(updateQuery.GetModel()).
		TableExpr("schools").
		Where("id = ?", schoolId).
		Update(); err != nil {
		return richErrors.Wrap(err, "failed to update name")
	}
	return nil
}

func (s SchoolStore) NewSchool(schoolName, userId string) (*cSchool.School, error) {
	id := uuid.New()
	inviteCode := uuid.New()
	school := School{
		Id:         id.String(),
		Name:       schoolName,
		InviteCode: inviteCode.String(),
	}
	userToSchoolRelation := UserToSchool{
		SchoolId: id.String(),
		UserId:   userId,
	}
	err := s.RunInTransaction(s.Context(), func(tx *pg.Tx) error {
		if _, err := s.Model(&school).Insert(); err != nil {
			return err
		}
		if _, err := s.Model(&userToSchoolRelation).Insert(); err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		return nil, err
	}
	return &cSchool.School{
		Id:         school.Id,
		Name:       school.Name,
		InviteCode: school.InviteCode,
	}, nil
}

func (s SchoolStore) GetSchool(schoolId string) (*cSchool.School, error) {
	var school School
	if err := s.Model(&school).
		Relation("Users").
		Relation("Subscription").
		Where("school.id=?", schoolId).
		Select(); err != nil {
		return nil, err
	}

	userData := make([]*cSchool.User, 0)
	for _, user := range school.Users {
		userData = append(userData, &cSchool.User{
			Id:    user.Id,
			Email: user.Email,
			Name:  user.Name,
		})
	}

	result := cSchool.School{
		Id:         school.Id,
		Name:       school.Name,
		InviteCode: school.InviteCode,
		Users:      userData,
		CreatedAt:  school.CreatedAt,
	}
	if (Subscription{}) != school.Subscription {
		result.Subscription = cSchool.Subscription{
			Id:                 school.Subscription.Id,
			CancelUrl:          school.Subscription.CancelUrl,
			Currency:           school.Subscription.Currency,
			Email:              school.Subscription.Email,
			EventTime:          school.Subscription.EventTime,
			NextBillDate:       school.Subscription.NextBillDate,
			Status:             school.Subscription.Status,
			SubscriptionId:     school.Subscription.SubscriptionId,
			SubscriptionPlanId: school.Subscription.SubscriptionPlanId,
			PaddleUserId:       school.Subscription.PaddleUserId,
			UpdateUrl:          school.Subscription.UpdateUrl,
			MarketingConsent:   school.Subscription.MarketingConsent,
		}
	}

	return &result, nil
}

func (s SchoolStore) GetStudents(schoolId, classId string, active *bool) ([]cSchool.Student, error) {
	var students []Student
	res := make([]cSchool.Student, 0)

	query := s.Model(&students).
		Where("student.school_id=?", schoolId).
		Order("name").
		Relation("Classes").
		Relation("ProfileImage")
	if classId != "" {
		query = query.
			Join("LEFT JOIN student_to_classes AS stc on student.id=stc.student_id").
			Where("stc.class_id=?", classId)
	}
	if active != nil {
		query = query.
			Where("active=?", active)
	}

	if err := query.Select(); err == pg.ErrNoRows {
		return res, nil
	} else if err != nil {
		return nil, richErrors.Wrap(err, "Failed querying student")
	}

	for _, s := range students {
		classes := make([]cSchool.Class, 0)
		for _, class := range s.Classes {
			classes = append(classes, cSchool.Class{
				Id:   class.Id,
				Name: class.Name,
			})
		}

		res = append(res, cSchool.Student{
			Id:       s.Id,
			Name:     s.Name,
			SchoolId: s.SchoolId,
			ProfileImage: cSchool.Image{
				Id:        s.ProfileImage.Id.String(),
				ObjectKey: s.ProfileImage.ObjectKey,
			},
			DateOfBirth: s.DateOfBirth,
			Active:      *s.Active,
			Classes:     classes,
		})
	}

	return res, nil
}

func (s SchoolStore) GetClassAttendance(classId, session string) ([]cSchool.Attendance, error) {
	var attendance []Attendance
	res := make([]cSchool.Attendance, 0)

	if session == "" {
		session = "1970-01-01"
	}
	if err := s.Model(&attendance).
		Where("class_id=?", classId).
		Where("date::date=?", session).
		Relation("Student").
		Relation("Class.Students").
		Select(); err != nil {
		return res, err
	}

	for _, v := range attendance {
		students := make([]cSchool.Student, 0)
		for _, student := range v.Class.Students {
			students = append(students, cSchool.Student{
				Id:   student.Id,
				Name: student.Name,
			})
		}

		res = append(res, cSchool.Attendance{
			Id:        v.Id,
			StudentId: v.StudentId,
			Class: cSchool.Class{
				Students: students,
			},
		})
	}

	return res, nil
}

func (s SchoolStore) NewStudent(student cSchool.Student, classes []string, guardians map[string]int) error {
	newStudent := Student{
		Id:             student.Id,
		Name:           student.Name,
		SchoolId:       student.SchoolId,
		DateOfBirth:    student.DateOfBirth,
		Gender:         Gender(student.Gender),
		DateOfEntry:    student.DateOfEntry,
		Note:           student.Note,
		CustomId:       student.CustomId,
		Active:         &student.Active,
		ProfileImageId: student.ProfileImage.Id,
	}

	classRelationships := make([]StudentToClass, len(classes))
	for i, class := range classes {
		classRelationships[i] = StudentToClass{
			StudentId: newStudent.Id,
			ClassId:   class,
		}
	}

	guardianRelationships := make([]GuardianToStudent, 0)
	for id, guardian := range guardians {
		guardianRelationships = append(guardianRelationships, GuardianToStudent{
			StudentId:    newStudent.Id,
			GuardianId:   id,
			Relationship: GuardianRelationship(guardian),
		})
	}

	if err := s.RunInTransaction(s.Context(), func(tx *pg.Tx) error {
		if _, err := tx.Model(&newStudent).Insert(); err != nil {
			return richErrors.Wrap(err, "failed to save new student")
		}

		if len(classRelationships) > 0 {
			if _, err := tx.Model(&classRelationships).Insert(); err != nil {
				return richErrors.Wrap(err, "failed to save student to class relation")
			}
		}

		if len(guardianRelationships) > 0 {
			if _, err := tx.Model(&guardianRelationships).Insert(); err != nil {
				return richErrors.Wrap(err, "failed to save guardian to student relation")
			}
		}

		if student.ProfileImage.Id != "" {
			if _, err := tx.Model(&ImageToStudents{
				StudentId: newStudent.Id,
				ImageId:   newStudent.ProfileImageId,
			}).Insert(); err != nil {
				return richErrors.Wrap(err, "failed to save student to image relationship")
			}
		}
		return nil
	}); err != nil {
		return err
	}
	return nil
}

func (s SchoolStore) RefreshInviteCode(schoolId string) (*cSchool.School, error) {
	// TODO: This should be done in a single query
	var school School
	if err := s.Model(&school).
		Where("id=?", schoolId).
		Select(); err != nil {
		return nil, err
	}

	// Update invite code
	school.InviteCode = uuid.New().String()
	if _, err := s.Model(&school).WherePK().Update(); err != nil {
		return nil, err
	}
	return &cSchool.School{
		Id:         school.Id,
		Name:       school.Name,
		InviteCode: school.InviteCode,
	}, nil
}

func (s SchoolStore) NewDefaultCurriculum(schoolId string) error {
	c := createDefault()
	err := s.RunInTransaction(s.Context(),
		func(tx *pg.Tx) error {
			// Save the curriculum tree.
			if _, err := tx.Model(&c).Insert(); err != nil {
				return err
			}
			for _, area := range c.Areas {
				if _, err := tx.Model(&area).Insert(); err != nil {
					return err
				}
				for _, subject := range area.Subjects {
					if _, err := tx.Model(&subject).Insert(); err != nil {
						return err
					}
					for _, material := range subject.Materials {
						if _, err := tx.Model(&material).Insert(); err != nil {
							return err
						}
					}
				}
			}

			// Update the school with the new curriculum id
			if _, err := tx.Model(&School{Id: schoolId, CurriculumId: c.Id}).
				WherePK().
				UpdateNotZero(); err != nil {
				return richErrors.Wrap(err, "Failed saving curriculum")
			}
			return nil
		})
	if err != nil {
		return err
	}
	return nil
}

func (s SchoolStore) DeleteCurriculum(schoolId string) error {
	school := School{Id: schoolId}
	if err := s.Model(&school).WherePK().Select(); err != nil {
		return richErrors.Wrap(err, "failed to get school data")
	} else if school.CurriculumId == "" {
		return cSchool.EmptyCurriculumError
	}
	c := Curriculum{Id: school.CurriculumId}
	_, err := s.Model(&c).WherePK().Delete()
	if err != nil {
		return richErrors.Wrap(err, "failed to delete curriculum")
	}
	return nil
}

func (s SchoolStore) GetCurriculum(schoolId string) (*cSchool.Curriculum, error) {
	var school School
	err := s.Model(&school).
		Relation("Curriculum").
		Where("school.id=?", schoolId).
		Select()
	if err != nil {
		return nil, err
	}
	if school.CurriculumId == "" {
		return nil, cSchool.EmptyCurriculumError
	}

	return &cSchool.Curriculum{
		Id:   school.Curriculum.Id,
		Name: school.Curriculum.Name,
	}, nil
}

func (s SchoolStore) GetCurriculumAreas(schoolId string) ([]cSchool.Area, error) {
	var school School
	res := make([]cSchool.Area, 0)
	err := s.Model(&school).
		Relation("Curriculum").
		Relation("Curriculum.Areas").
		Where("school.id=?", schoolId).
		Select()
	if err != nil {
		return nil, err
	}
	if school.CurriculumId == "" {
		return nil, cSchool.EmptyCurriculumError
	}

	for _, v := range school.Curriculum.Areas {
		res = append(res, cSchool.Area{
			Id:   v.Id,
			Name: v.Name,
		})
	}
	return res, nil
}

func (s SchoolStore) NewClass(id string, name string, weekdays []time.Weekday, startTime, endTime time.Time) (string, error) {
	newClass := Class{
		Id:        uuid.New().String(),
		SchoolId:  id,
		Name:      name,
		StartTime: startTime,
		EndTime:   endTime,
	}
	var dbWeekdays []Weekday
	for _, weekday := range weekdays {
		dbWeekdays = append(dbWeekdays, Weekday{
			ClassId: newClass.Id,
			Day:     weekday,
		})
	}
	if err := s.DB.RunInTransaction(s.Context(), func(tx *pg.Tx) error {
		if _, err := tx.Model(&newClass).Insert(); err != nil {
			return richErrors.Wrap(err, "Failed saving new class")
		}
		if len(dbWeekdays) > 0 {
			if _, err := tx.Model(&dbWeekdays).Insert(); err != nil {
				return richErrors.Wrap(err, "Failed saving weekdays")
			}
		}
		return nil
	}); err != nil {
		return "", err
	}
	return newClass.Id, nil
}

func (s SchoolStore) GetSchoolClasses(schoolId string) ([]cSchool.Class, error) {
	var classes []Class
	res := make([]cSchool.Class, 0)

	if err := s.DB.Model(&classes).
		Where("school_id=?", schoolId).
		Relation("Weekdays").
		Select(); err != nil {
		return nil, err
	}

	for _, v := range classes {
		weekdays := make([]cSchool.Weekday, 0)
		for _, day := range v.Weekdays {
			weekdays = append(weekdays, cSchool.Weekday{
				Day: day.Day,
			})
		}
		res = append(res, cSchool.Class{
			Id:        v.Id,
			Name:      v.Name,
			StartTime: v.StartTime,
			EndTime:   v.EndTime,
			Weekdays:  weekdays,
		})
	}

	return res, nil
}

func (s SchoolStore) InsertGuardianWithRelation(input cSchool.GuardianWithRelation) (*cSchool.Guardian, error) {
	guardian := Guardian{
		Id:       uuid.New().String(),
		Name:     input.Name,
		Email:    input.Email,
		Phone:    input.Phone,
		Note:     input.Note,
		SchoolId: input.SchoolId,
		Address:  input.Address,
	}
	if err := s.RunInTransaction(s.Context(), func(tx *pg.Tx) error {
		if _, err := s.Model(&guardian).Insert(); err != nil {
			return richErrors.Wrap(err, "failed to insert new guardian")
		}

		// Creating relation is optional
		if input.StudentId != nil && input.Relationship != nil {
			relation := GuardianToStudent{
				StudentId:    *input.StudentId,
				GuardianId:   guardian.Id,
				Relationship: GuardianRelationship(*input.Relationship),
			}
			if _, err := s.Model(&relation).Insert(); err != nil {
				return richErrors.Wrap(err, "failed to insert guardian to student relation")
			}
		}
		return nil
	}); err != nil {
		return nil, err
	}

	return &cSchool.Guardian{
		Id:       guardian.Id,
		Name:     guardian.Name,
		Email:    guardian.Email,
		Phone:    guardian.Phone,
		Note:     guardian.Note,
		SchoolId: guardian.SchoolId,
		Address:  input.Address,
	}, nil
}

func (s SchoolStore) GetGuardians(schoolId string) ([]cSchool.Guardian, error) {
	var guardian []Guardian
	res := make([]cSchool.Guardian, 0)

	if err := s.DB.Model(&guardian).
		Where("school_id=?", schoolId).
		Select(); err != nil {
		return nil, richErrors.Wrap(err, "failed to query school's guardians")
	}

	for _, v := range guardian {
		res = append(res, cSchool.Guardian{
			Id:    v.Id,
			Name:  v.Name,
			Email: v.Email,
			Phone: v.Phone,
			Note:  v.Note,
		})
	}

	return res, nil
}

func (s SchoolStore) GetLessonPlans(schoolId string, date time.Time) ([]cSchool.LessonPlan, error) {
	var lessonPlan []LessonPlan
	if err := s.DB.Model(&lessonPlan).
		Where("date::date=? AND lesson_plan_details.school_id=?", date, schoolId).
		Relation("LessonPlanDetails").
		Relation("LessonPlanDetails.Area").
		Relation("LessonPlanDetails.Class").
		Relation("LessonPlanDetails.User").
		Select(); err != nil {
		return nil, richErrors.Wrap(err, "Failed to query school's lesson plan")
	}

	res := make([]cSchool.LessonPlan, len(lessonPlan))
	for i, plan := range lessonPlan {
		res[i] = cSchool.LessonPlan{
			Id:          plan.Id,
			Title:       plan.LessonPlanDetails.Title,
			ClassId:     plan.LessonPlanDetails.ClassId,
			ClassName:   plan.LessonPlanDetails.Class.Name,
			Date:        *plan.Date,
			Description: plan.LessonPlanDetails.Description,
			UserId:      plan.LessonPlanDetails.UserId,
			UserName:    plan.LessonPlanDetails.User.Name,
		}
		if plan.LessonPlanDetails.AreaId != "" {
			res[i].AreaId = plan.LessonPlanDetails.Area.Id
			res[i].AreaName = plan.LessonPlanDetails.Area.Name
		}
	}
	return res, nil
}

func (s SchoolStore) GetLessonFiles(schoolId string) ([]cSchool.File, error) {
	var files []File
	if err := s.DB.Model(&files).
		Where("school_id=?", schoolId).
		Select(); err != nil {
		return nil, richErrors.Wrap(err, "Failed to query school's files")
	}

	result := make([]cSchool.File, len(files))
	for idx, file := range files {
		result[idx] = cSchool.File{
			Id:   file.Id,
			Name: file.Name,
		}
	}
	return result, nil
}

func (s SchoolStore) CreateFile(schoolId string, file multipart.File, fileHeader *multipart.FileHeader) (*string, error) {
	newFile := File{
		Id:       uuid.New().String(),
		SchoolId: schoolId,
		Name:     fileHeader.Filename,
	}
	fileKey, err := s.FileStorage.Save(schoolId, newFile.Id, file, fileHeader.Size)
	if err != nil {
		return nil, richErrors.Wrap(err, "failed to save file to s3")
	}
	newFile.ObjectKey = fileKey
	if _, err := s.Model(&newFile).Insert(); err != nil {
		return nil, richErrors.Wrap(err, "failed to create file:")
	}
	return &newFile.Id, nil
}

func (s SchoolStore) DeleteFile(fileId string) error {
	file := File{Id: fileId}
	if err := s.Model(&file).
		WherePK().
		Column("object_key").
		Select(); err != nil {
		return richErrors.Wrap(err, "failed to query target file")
	}

	if err := s.FileStorage.Delete(file.ObjectKey); err != nil {
		return richErrors.Wrap(err, "failed to delete file from s3")
	}

	if _, err := s.Model(&file).WherePK().Delete(); err != nil {
		return richErrors.Wrap(err, "failed to delete file")
	}
	return nil
}

func (s SchoolStore) UpdateFile(fileId, fileName string) (*cSchool.File, error) {
	obj := File{
		Id:   fileId,
		Name: fileName,
	}
	res, err := s.Model(&obj).Column("name").
		Returning("*").WherePK().Update()
	if err != nil {
		return nil, richErrors.Wrap(err, "failed update file:")
	}

	if res.RowsAffected() == 0 {
		return nil, pg.ErrNoRows
	}

	return &cSchool.File{
		Id:   obj.Id,
		Name: obj.Name,
	}, nil
}

func (s SchoolStore) CreateLessonPlan(planInput domain.LessonPlan) (*domain.LessonPlan, error) {
	planDetails := LessonPlanDetails{
		Id:          uuid.New().String(),
		ClassId:     planInput.ClassId,
		Title:       planInput.Title,
		Description: planInput.Description,
		AreaId:      planInput.AreaId,
		SchoolId:    planInput.SchoolId,
		UserId:      planInput.UserId,
	}

	if planInput.MaterialId != "" {
		relatedMaterial := Material{Id: planInput.MaterialId}
		if err := s.Model(&relatedMaterial).
			WherePK().
			Relation("Subject.area_id").
			Select(); err != nil {
			return nil, richErrors.Wrap(err, "failed to get related material's area_id")
		}
		planDetails.MaterialId = planInput.MaterialId
		planDetails.AreaId = relatedMaterial.Subject.AreaId
	}

	var plans []LessonPlan
	var studentRelations []LessonPlanToStudents
	plan := LessonPlan{
		Id:                  uuid.New().String(),
		Date:                &planInput.Date,
		LessonPlanDetailsId: planDetails.Id,
	}
	for i := range planInput.Students {
		studentRelations = append(studentRelations, LessonPlanToStudents{
			LessonPlanId: plan.Id,
			StudentId:    planInput.Students[i].Id,
		})
	}
	plans = append(plans, plan)
	// Create all instance of repeating plans and save to db. This will make it easy to
	// retrieve, modify, and attach metadata to individual instances of the plans down the road
	if planInput.Repetition.Type != domain.RepetitionNone {
		// If nil, repetition_type column in db will automatically be 0, since it has useZero tag.
		planDetails.RepetitionType = planInput.Repetition.Type
		planDetails.RepetitionEndDate = planInput.Repetition.EndDate

		currentDate := planInput.Date
		monthToAdd := 0
		daysToAdd := 0
		switch planInput.Repetition.Type {
		case domain.RepetitionDaily:
			daysToAdd = 1
		case domain.RepetitionWeekly:
			daysToAdd = 7
		case domain.RepetitionMonthly:
			monthToAdd = 1
		}
		for {
			currentDate = currentDate.AddDate(0, monthToAdd, daysToAdd)
			if currentDate.After(planInput.Repetition.EndDate) {
				break
			}
			// Create a separate date value to be referenced by each plan,
			// since currentDate will keep getting updated
			planFinalDate := currentDate
			newPlan := LessonPlan{
				Id:                  uuid.New().String(),
				Date:                &planFinalDate,
				LessonPlanDetailsId: planDetails.Id,
			}
			for i := range planInput.Students {
				studentRelations = append(studentRelations, LessonPlanToStudents{
					LessonPlanId: newPlan.Id,
					StudentId:    planInput.Students[i].Id,
				})
			}
			plans = append(plans, newPlan)
		}
	}

	fileRelations := make([]FileToLessonPlan, len(planInput.FileIds))
	for idx, file := range planInput.FileIds {
		fileRelations[idx] = FileToLessonPlan{
			LessonPlanDetailsId: planDetails.Id,
			FileId:              file,
		}
	}

	links := make([]LessonPlanLink, 0)
	for _, link := range planInput.Links {
		links = append(links, LessonPlanLink{
			Id:                  uuid.New(),
			Title:               link.Title,
			Url:                 link.Url,
			Image:               link.Image,
			Description:         link.Description,
			LessonPlanDetailsId: planDetails.Id,
		})
	}

	if err := s.RunInTransaction(s.Context(), func(tx *pg.Tx) error {
		if _, err := tx.Model(&planDetails).Insert(); err != nil {
			return richErrors.Wrap(err, "failed to save lesson plan details")
		}
		if _, err := tx.Model(&plans).Insert(); err != nil {
			return richErrors.Wrap(err, "failed to save lesson plan")
		}
		if len(fileRelations) > 0 {
			if _, err := tx.Model(&fileRelations).Insert(); err != nil {
				return richErrors.Wrap(err, "failed to save file relations")
			}
		}
		if len(studentRelations) > 0 {
			if _, err := tx.Model(&studentRelations).Insert(); err != nil {
				return richErrors.Wrap(err, "failed to save file relations")
			}
		}
		if len(links) > 0 {
			if _, err := tx.Model(&links).Insert(); err != nil {
				return richErrors.Wrap(err, "failed to save links")
			}
		}
		return nil
	}); err != nil {
		return nil, err
	}

	return &domain.LessonPlan{
		Id:          planDetails.Id,
		Title:       planDetails.Title,
		Description: planDetails.Description,
		ClassId:     planDetails.ClassId,
	}, nil
}

func (s SchoolStore) GetUser(email string) (*cSchool.User, error) {
	var model cSchool.User
	if err := s.Model(&model).
		Column("id", "email", "name").
		Where("email=?", email).
		Select(); err != nil {
		return nil, err
	}
	return &cSchool.User{
		Id:    model.Id,
		Email: model.Email,
		Name:  model.Name,
	}, nil
}

func (s SchoolStore) CreateImage(schoolId string, image multipart.File, header *multipart.FileHeader) (string, error) {
	newImage := Image{
		Id:       uuid.New(),
		SchoolId: schoolId,
	}
	fileKey, err := s.ImageStorage.Save(schoolId, newImage.Id.String(), image, header.Size)
	if err != nil {
		return "", richErrors.Wrap(err, "failed to save file to s3")
	}
	newImage.ObjectKey = fileKey
	if _, err := s.Model(&newImage).Insert(); err != nil {
		return "", richErrors.Wrap(err, "failed to create file:")
	}
	return newImage.Id.String(), nil
}

func (s SchoolStore) DeleteUser(schoolId string, userId string) error {
	var relation UserToSchool
	if _, err := s.Model(&relation).
		Where("school_id = ? AND user_id = ?", schoolId, userId).
		Delete(); err != nil {
		return richErrors.Wrap(err, "failed to delete user from school relation")
	}
	return nil
}

// TODO: Before Commit verify that this works properly
func (s SchoolStore) NewCurriculum(schoolId string, name string) error {
	curriculum := Curriculum{
		Id:   uuid.New().String(),
		Name: name,
	}
	school := School{Id: schoolId, CurriculumId: curriculum.Id}
	if err := s.RunInTransaction(s.Context(), func(tx *pg.Tx) error {
		if _, err := s.Model(&curriculum).Insert(); err != nil {
			return richErrors.Wrap(err, "failed to save curriculum")
		}
		if _, err := s.Model(&school).
			WherePK().
			Set("curriculum_id = ?curriculum_id").
			Update(); err != nil {
			return richErrors.Wrap(err, "failed to save curriculum")
		}
		return nil
	}); err != nil {
		return err
	}
	return nil
}

func (s SchoolStore) CreateStudentVideo(schoolId string, studentId string, video domain.Video) error {
	newVideo := Video{
		Id:            video.Id,
		UploadUrl:     video.UploadUrl,
		UploadId:      video.UploadId,
		Status:        video.Status,
		UploadTimeout: video.UploadTimeout,
		CreatedAt:     video.CreatedAt,
		UserId:        video.UserId,
		SchoolId:      schoolId,
	}

	if err := s.RunInTransaction(s.Context(), func(tx *pg.Tx) error {
		if _, err := tx.Model(&newVideo).Insert(); err != nil {
			return richErrors.Wrap(err, "failed to save video metadata to db")
		}
		if studentId != "" {
			studentRelation := VideoToStudents{
				StudentId: studentId,
				VideoId:   video.Id,
			}
			if _, err := tx.Model(&studentRelation).Insert(); err != nil {
				return richErrors.Wrap(err, "failed to save video to student relation to DB")
			}
		}
		return nil
	}); err != nil {
		return err
	}

	return nil
}

func (s SchoolStore) GetReports(schoolId string) ([]domain.ProgressReport, error) {
	var reports []ProgressReport
	err := s.DB.Model(&reports).
		Order("period_start desc").
		Where("school_id=?", schoolId).
		Select()

	result := make([]domain.ProgressReport, 0)
	for _, report := range reports {
		result = append(result, domain.ProgressReport{
			Id:          report.Id,
			Title:       report.Title,
			PeriodStart: report.PeriodStart,
			PeriodEnd:   report.PeriodEnd,
			Published:   report.Published,
		})
	}

	return result, err
}
