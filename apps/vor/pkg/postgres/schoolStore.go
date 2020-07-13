package postgres

import (
	cLessonPlan "github.com/chrsep/vor/pkg/lessonplan"
	"mime/multipart"
	"time"

	"github.com/go-pg/pg/v10"
	"github.com/google/uuid"
	richErrors "github.com/pkg/errors"

	cSchool "github.com/chrsep/vor/pkg/school"
)

type SchoolStore struct {
	*pg.DB
	FileStorage  FileStorage
	ImageStorage ImageStorage
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
	err := s.RunInTransaction(func(tx *pg.Tx) error {
		if err := s.Insert(&school); err != nil {
			return err
		}
		if err := s.Insert(&userToSchoolRelation); err != nil {
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
		Where("id=?", schoolId).
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

	return &cSchool.School{
		Id:         school.Id,
		Name:       school.Name,
		InviteCode: school.InviteCode,
		Users:      userData,
	}, nil
}

func (s SchoolStore) GetStudents(schoolId, classId string, active *bool) ([]cSchool.Student, error) {
	var students []Student
	res := make([]cSchool.Student, 0)

	query := s.Model(&students).
		Where("school_id=?", schoolId).
		Order("name").
		Relation("Classes")
	if classId != "" {
		query = query.
			Join("LEFT JOIN student_to_classes AS stc on id=stc.student_id").
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
			Id:          s.Id,
			Name:        s.Name,
			SchoolId:    s.SchoolId,
			ProfilePic:  s.ProfilePic,
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
	if student.Id == "" {
		student.Id = uuid.New().String()
	}
	if err := s.RunInTransaction(func(tx *pg.Tx) error {
		classRelations := make([]StudentToClass, len(classes))
		for i, class := range classes {
			classRelations[i] = StudentToClass{
				StudentId: student.Id,
				ClassId:   class,
			}
		}

		guardianRelations := make([]GuardianToStudent, 0)
		for id, guardian := range guardians {
			guardianRelations = append(guardianRelations, GuardianToStudent{
				StudentId:    student.Id,
				GuardianId:   id,
				Relationship: GuardianRelationship(guardian),
			})
		}

		if err := tx.Insert(&Student{
			Id:          student.Id,
			Name:        student.Name,
			SchoolId:    student.SchoolId,
			DateOfBirth: student.DateOfBirth,
			Gender:      Gender(student.Gender),
			DateOfEntry: student.DateOfEntry,
			Note:        student.Note,
			CustomId:    student.CustomId,
			Active:      &student.Active,
			ProfilePic:  student.ProfilePic,
		}); err != nil {
			return richErrors.Wrap(err, "failed to save new student")
		}
		if len(classRelations) > 0 {
			if err := tx.Insert(&classRelations); err != nil {
				return richErrors.Wrap(err, "failed to save student to class relation")
			}
		}
		if len(guardianRelations) > 0 {
			if err := tx.Insert(&guardianRelations); err != nil {
				return richErrors.Wrap(err, "failed to save guardian to student relation")
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
	if err := s.Update(&school); err != nil {
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
	err := s.RunInTransaction(
		func(tx *pg.Tx) error {
			// Save the curriculum tree.
			if err := tx.Insert(&c); err != nil {
				return err
			}
			for _, area := range c.Areas {
				if err := tx.Insert(&area); err != nil {
					return err
				}
				for _, subject := range area.Subjects {
					if err := tx.Insert(&subject); err != nil {
						return err
					}
					for _, material := range subject.Materials {
						if err := tx.Insert(&material); err != nil {
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
	school, err := s.GetSchool(schoolId)
	if err != nil {
		return err
	}
	if school.CurriculumId == "" {
		return cSchool.EmptyCurriculumError
	}
	c := Curriculum{Id: school.CurriculumId}
	return s.Delete(&c)
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
	if err := s.DB.RunInTransaction(func(tx *pg.Tx) error {
		if err := tx.Insert(&newClass); err != nil {
			return richErrors.Wrap(err, "Failed saving new class")
		}
		if len(dbWeekdays) > 0 {
			if err := tx.Insert(&dbWeekdays); err != nil {
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
	}
	if err := s.RunInTransaction(func(tx *pg.Tx) error {
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
	if err := s.Insert(&newFile); err != nil {
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

	return s.Delete(&file)
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

func (s SchoolStore) CreateLessonPlan(planInput cLessonPlan.PlanData) (*cLessonPlan.LessonPlan, error) {
	planDetails := LessonPlanDetails{
		Id:          uuid.New().String(),
		ClassId:     planInput.ClassId,
		Title:       planInput.Title,
		Description: planInput.Description,
		AreaId:      planInput.AreaId,
		SchoolId:    planInput.SchoolId,
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
			StudentId:    planInput.Students[i],
		})
	}
	plans = append(plans, plan)
	// Create all instance of repeating plans and save to db. This will make it easy to
	// retrieve, modify, and attach metadata to individual instances of the plans down the road
	if planInput.Repetition != nil && planInput.Repetition.Type != cLessonPlan.RepetitionNone {
		// If nil, repetition_type column in db will automatically be 0, since it has useZero tag.
		planDetails.RepetitionType = planInput.Repetition.Type
		planDetails.RepetitionEndDate = planInput.Repetition.EndDate

		currentDate := planInput.Date
		monthToAdd := 0
		daysToAdd := 0
		switch planInput.Repetition.Type {
		case cLessonPlan.RepetitionDaily:
			daysToAdd = 1
		case cLessonPlan.RepetitionWeekly:
			daysToAdd = 7
		case cLessonPlan.RepetitionMonthly:
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
					StudentId:    planInput.Students[i],
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

	if err := s.RunInTransaction(func(tx *pg.Tx) error {
		if err := tx.Insert(&planDetails); err != nil {
			return richErrors.Wrap(err, "failed to save lesson plan details")
		}
		if err := tx.Insert(&plans); err != nil {
			return richErrors.Wrap(err, "failed to save lesson plan")
		}
		if len(fileRelations) > 0 {
			if err := tx.Insert(&fileRelations); err != nil {
				return richErrors.Wrap(err, "failed to save file relations")
			}
		}
		if len(studentRelations) > 0 {
			if err := tx.Insert(&studentRelations); err != nil {
				return richErrors.Wrap(err, "failed to save file relations")
			}
		}
		return nil
	}); err != nil {
		return nil, err
	}

	return &cLessonPlan.LessonPlan{
		Id:          planDetails.Id,
		Title:       planDetails.Title,
		Description: planDetails.Description,
		ClassId:     planDetails.ClassId,
	}, nil
}

func (s SchoolStore) CreateImage(schoolId string, image multipart.File, header *multipart.FileHeader) (string, error) {
	panic("implement me")
}
