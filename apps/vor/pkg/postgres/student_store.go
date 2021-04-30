package postgres

import (
	"github.com/chrsep/vor/pkg/domain"
	richErrors "github.com/pkg/errors"
	"mime/multipart"
	"strings"
	"time"

	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
	"github.com/google/uuid"
)

type StudentStore struct {
	*pg.DB
	ImageStorage ImageStorage
}

func (s StudentStore) NewClassRelation(studentId string, classId string) error {
	relation := StudentToClass{ClassId: classId, StudentId: studentId}
	if _, err := s.Model(&relation).Insert(); err != nil {
		return richErrors.Wrap(err, "failed to save class to student relation")
	}
	return nil
}

func (s StudentStore) DeleteClassRelation(studentId string, classId string) error {
	var relation StudentToClass
	if _, err := s.Model(&relation).
		Where("student_id = ? AND class_id = ?", studentId, classId).
		Delete(); err != nil {
		return richErrors.Wrap(err, "failed to delete class from student relation")
	}
	return nil
}

func (s StudentStore) InsertObservation(
	studentId string,
	creatorId string,
	longDesc string,
	shortDesc string,
	category string,
	eventTime time.Time,
	images []uuid.UUID,
	areaId uuid.UUID,
	visibleToGuardians bool,
) (*Observation, error) {
	observationId := uuid.New()
	observation := Observation{
		Id:                 observationId.String(),
		StudentId:          studentId,
		ShortDesc:          shortDesc,
		LongDesc:           longDesc,
		CategoryId:         category,
		CreatorId:          creatorId,
		CreatedDate:        time.Now(),
		EventTime:          eventTime,
		AreaId:             areaId,
		VisibleToGuardians: visibleToGuardians,
	}
	observationImages := make([]ObservationToImage, 0)
	for i := range images {
		observationImages = append(observationImages, ObservationToImage{
			ObservationId: observation.Id,
			ImageId:       images[i],
		})
	}
	if err := s.RunInTransaction(s.Context(), func(tx *pg.Tx) error {
		if _, err := tx.Model(&observation).Insert(); err != nil {
			return richErrors.Wrap(err, "failed to save observations")
		}
		if len(observationImages) > 0 {
			if _, err := tx.Model(&observationImages).Insert(); err != nil {
				return richErrors.Wrap(err, "failed to save observation images")
			}
		}
		if err := tx.Model(&observation).
			WherePK().
			Relation("Images").
			Relation("Creator").
			Relation("Area").
			Select(); err != nil {
			return richErrors.Wrap(err, "failed to get complete observation data")
		}
		return nil
	}); err != nil {
		return nil, err
	}
	return &observation, nil
}

func (s StudentStore) InsertAttendance(studentId string, classId string, date time.Time) (*Attendance, error) {
	attendanceId := uuid.New()
	attendance := Attendance{
		Id:        attendanceId.String(),
		StudentId: studentId,
		ClassId:   classId,
		Date:      date,
	}
	if _, err := s.Model(&attendance).Insert(); err != nil {
		return nil, err
	}
	return &attendance, nil
}

func (s StudentStore) GetAttendance(studentId string) ([]Attendance, error) {
	var attendance []Attendance
	if err := s.Model(&attendance).
		Where("student_id=?", studentId).
		Relation("Student").
		Relation("Class").
		Select(); err != nil {
		return nil, err
	}
	return attendance, nil
}

func (s StudentStore) DeleteGuardianRelation(studentId string, guardianId string) error {
	var relation GuardianToStudent
	if _, err := s.Model(&relation).
		Where("student_id=? AND guardian_id=?", studentId, guardianId).
		Delete(); err != nil {
		return richErrors.Wrap(err, "failed to delete guardian relation")
	}
	return nil
}

func (s StudentStore) GetObservations(studentId string, search string, startDate string, endDate string) ([]Observation, error) {
	var observations []Observation
	query := s.Model(&observations).
		Relation("Student").
		Relation("Creator").
		Relation("Area").
		Relation("Images").
		Order("created_date").
		Where("student_id=?", studentId)

	if startDate != "" {
		query = query.Where("event_time >= ?", startDate)
	}
	if endDate != "" {
		query = query.Where("event_time <= ?", endDate)
	}
	if search != "" {
		query = query.Where("to_tsvector(coalesce(long_desc, '') || ' ' || short_desc) @@ to_tsquery(?)", strings.ReplaceAll(search, " ", " & ")+":*")
	}

	if err := query.Select(); err != nil {
		return nil, err
	}
	return observations, nil
}

func (s StudentStore) CheckPermissions(studentId string, userId string) (bool, error) {
	var student Student

	if err := s.Model(&student).
		Relation("School").
		Relation("School.Users", func(q *orm.Query) (*orm.Query, error) {
			return q.Where("user_id = ?", userId), nil
		}).
		Where("student.id=?", studentId).
		Select(); err == pg.ErrNoRows {
		return false, nil
	} else if err != nil {
		return false, richErrors.Wrap(err, "failed checking user access to student")
	}
	if len(student.School.Users) > 0 {
		return true, nil

	} else {
		return false, nil
	}
}

func (s StudentStore) GetProgress(studentId string) ([]StudentMaterialProgress, error) {
	var progresses []StudentMaterialProgress
	if err := s.Model(&progresses).
		Relation("Material").
		Relation("Material.Subject").
		Relation("Material.Subject.Area").
		Where("student_id=?", studentId).
		Select(); err != nil {
		return nil, err
	}
	return progresses, nil
}

func (s StudentStore) UpdateProgress(progress StudentMaterialProgress) (*StudentMaterialProgress, error) {
	if _, err := s.Model(&progress).
		OnConflict("(material_id, student_id) DO UPDATE").
		Insert(); err != nil {
		return nil, richErrors.Wrap(err, "failed to upsert material progress")
	}
	if err := s.Model(&progress).WherePK().
		Relation("Material").
		Relation("Material.Subject").
		Relation("Material.Subject.Area").
		Select(); err != nil {
		return nil, richErrors.Wrap(err, "failed to select the updated material progress")
	}
	return &progress, nil
}

func (s StudentStore) Get(studentId string) (*Student, error) {
	var student Student
	if err := s.DB.Model(&student).
		Where("Student.id=?", studentId).
		Relation("Guardians").
		Relation("Classes").
		Relation("ProfileImage").
		Select(); err != nil {
		return nil, err
	}
	return &student, nil
}

func (s StudentStore) UpdateStudent(student *Student) error {
	if _, err := s.DB.Model(student).
		WherePK().
		UpdateNotZero(); err != nil {
		return richErrors.Wrap(err, "failed to update student")
	}
	return nil
}

func (s StudentStore) DeleteStudent(studentId string) error {
	student := Student{Id: studentId}
	_, err := s.DB.Model(&student).WherePK().Delete()
	if err != nil {
		return richErrors.Wrap(err, "failed to delete student")
	}
	return nil
}

func (s StudentStore) InsertGuardianRelation(studentId string, guardianId string, relationship int) error {
	relation := GuardianToStudent{
		StudentId:    studentId,
		GuardianId:   guardianId,
		Relationship: GuardianRelationship(relationship),
	}
	if _, err := s.Model(&relation).Insert(); err != nil {
		return richErrors.Wrap(err, "failed to save guardian relation")
	}
	return nil
}

func (s StudentStore) GetGuardianRelation(studentId string, guardianId string) (*GuardianToStudent, error) {
	var relation GuardianToStudent
	if err := s.Model(&relation).
		Where("student_id=? AND guardian_id=?", studentId, guardianId).
		Select(); err != nil {
		return nil, richErrors.Wrap(err, "failed to query guardian to student relation")
	}
	return &relation, nil
}

func (s StudentStore) GetLessonPlans(studentId string, date time.Time) ([]LessonPlan, error) {
	var lessonPlan []LessonPlan
	if err := s.DB.Model(&lessonPlan).
		Join("LEFT JOIN lesson_plan_to_students AS lpts ON lesson_plan.id=lpts.lesson_plan_id").
		Where("date::date=? AND lpts.student_id=?", date, studentId).
		Relation("LessonPlanDetails").
		Relation("LessonPlanDetails.Area").
		Relation("LessonPlanDetails.User").
		Select(); err != nil {
		return nil, richErrors.Wrap(err, "Failed to query student's lesson plan")
	}

	return lessonPlan, nil
}

func (s StudentStore) CreateImage(studentId string, image multipart.File, header *multipart.FileHeader) (domain.Image, error) {
	queriedStudent := Student{Id: studentId}
	if err := s.Model(&queriedStudent).
		WherePK().
		Select(); err != nil {
		return domain.Image{}, richErrors.Wrap(err, "failed to query student")
	}

	// db data
	newImage := Image{
		Id:        uuid.New(),
		SchoolId:  queriedStudent.SchoolId,
		CreatedAt: time.Now(),
	}
	studentImageRelation := ImageToStudents{
		StudentId: queriedStudent.Id,
		ImageId:   newImage.Id.String(),
	}

	// save image to s3
	objectKey, err := s.ImageStorage.Save(queriedStudent.SchoolId, newImage.Id.String(), image, header.Size)
	if err != nil {
		return domain.Image{}, richErrors.Wrap(err, "failed to save file to s3")
	}
	newImage.ObjectKey = objectKey

	// save data to db
	if err := s.RunInTransaction(s.Context(), func(tx *pg.Tx) error {
		if _, err := tx.Model(&newImage).Insert(); err != nil {
			return richErrors.Wrap(err, "failed to save image")
		}
		if _, err := tx.Model(&studentImageRelation).Insert(); err != nil {
			return richErrors.Wrap(err, "failed to save student image relation")
		}
		return nil
	}); err != nil {
		return domain.Image{}, err
	}
	return domain.Image{
		Id:        newImage.Id,
		ObjectKey: newImage.ObjectKey,
		CreatedAt: newImage.CreatedAt,
	}, nil
}

func (s StudentStore) FindStudentImages(id string) ([]Image, error) {
	student := Student{Id: id}
	if err := s.Model(&student).
		WherePK().
		Relation("Images", func(query *orm.Query) (*orm.Query, error) {
			return query.Order("image.created_at DESC"), nil
		}).
		Select(); err != nil {
		return nil, richErrors.Wrap(err, "failed to find student")
	}
	return student.Images, nil
}

func (s StudentStore) FindStudentVideos(studentId string) ([]domain.Video, error) {
	student := Student{Id: studentId}
	if err := s.Model(&student).
		WherePK().
		Relation("Videos", func(query *orm.Query) (*orm.Query, error) {
			q := query.
				Order("video.created_at DESC").
				Where("video.status = 'ready' or extract(epoch from (now() - video.created_at)) < video.upload_timeout")
			return q, nil
		}).
		Select(); err != nil {
		return nil, richErrors.Wrap(err, "failed to query video to db")
	}

	videos := make([]domain.Video, 0)
	for _, video := range student.Videos {
		videos = append(videos, domain.Video{
			Id:            video.Id,
			UploadUrl:     video.UploadUrl,
			UploadId:      video.UploadId,
			Status:        video.Status,
			UploadTimeout: video.UploadTimeout,
			CreatedAt:     video.CreatedAt,
			UserId:        video.UserId,
			SchoolId:      video.SchoolId,
			AssetId:       video.AssetId,
			PlaybackId:    video.PlaybackId,
			PlaybackUrl:   video.PlaybackUrl,
			ThumbnailUrl:  video.ThumbnailUrl,
		})
	}
	return videos, nil
}

func (s StudentStore) FindCurriculum(studentId string) (domain.Curriculum, error) {
	student := Student{Id: studentId}
	if err := s.Model(&student).
		WherePK().
		Relation("School").
		Relation("School.Curriculum").
		Relation("School.Curriculum.Areas").
		Relation("School.Curriculum.Areas.Subjects", func(q *orm.Query) (*orm.Query, error) {
			return q.Order("order"), nil
		}).
		Relation("School.Curriculum.Areas.Subjects.Materials", func(q *orm.Query) (*orm.Query, error) {
			return q.Order("order"), nil
		}).
		Select(); err != nil {
		return domain.Curriculum{}, richErrors.Wrap(err, "failed to query school")
	}

	curriculum := student.School.Curriculum
	var areas []domain.Area
	for _, a := range curriculum.Areas {
		var subjects []domain.Subject
		for _, s := range a.Subjects {
			var materials []domain.Material
			for _, m := range s.Materials {
				materials = append(materials, domain.Material{
					Id:          m.Id,
					SubjectId:   m.SubjectId,
					Name:        m.Name,
					Order:       m.Order,
					Description: m.Description,
				})
			}
			subjects = append(subjects, domain.Subject{
				Id:          s.Id,
				AreaId:      s.AreaId,
				Name:        s.Name,
				Order:       s.Order,
				Description: s.Description,
				Materials:   materials,
			})
		}
		areas = append(areas, domain.Area{
			Id:          a.Id,
			Name:        a.Name,
			Subjects:    subjects,
			Description: a.Description,
		})
	}

	return domain.Curriculum{
		Id:          curriculum.Id,
		Name:        curriculum.Name,
		Areas:       areas,
		Description: curriculum.Descriptions,
	}, nil
}
