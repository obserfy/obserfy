package postgres

import (
	richErrors "github.com/pkg/errors"
	"mime/multipart"
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

func (s StudentStore) InsertObservation(studentId string, creatorId string, longDesc string, shortDesc string, category string, eventTime time.Time, images []uuid.UUID, areaId uuid.UUID) (*Observation, error) {
	observationId := uuid.New()
	observation := Observation{
		Id:          observationId.String(),
		StudentId:   studentId,
		ShortDesc:   shortDesc,
		LongDesc:    longDesc,
		CategoryId:  category,
		CreatorId:   creatorId,
		CreatedDate: time.Now(),
		EventTime:   eventTime,
		AreaId:      areaId,
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

func (s StudentStore) GetObservations(studentId string) ([]Observation, error) {
	var observations []Observation
	if err := s.Model(&observations).
		Where("student_id=?", studentId).
		Relation("Student").
		Relation("Creator").
		Relation("Area").
		Relation("Images").
		Order("created_date").
		Select(); err != nil {
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

func (s StudentStore) CreateImage(studentId string, image multipart.File, header *multipart.FileHeader) (string, error) {
	queriedStudent := Student{Id: studentId}
	if err := s.Model(&queriedStudent).
		WherePK().
		Select(); err != nil {
		return "", richErrors.Wrap(err, "failed to query student")
	}

	// db data
	newImage := Image{
		Id:       uuid.New(),
		SchoolId: queriedStudent.SchoolId,
	}
	studentImageRelation := ImageToStudents{
		StudentId: queriedStudent.Id,
		ImageId:   newImage.Id.String(),
	}

	// save image to s3
	objectKey, err := s.ImageStorage.Save(queriedStudent.SchoolId, newImage.Id.String(), image, header.Size)
	if err != nil {
		return "", richErrors.Wrap(err, "failed to save file to s3")
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
		return "", err
	}
	return newImage.Id.String(), nil
}

func (s StudentStore) FindStudentImages(id string) ([]Image, error) {
	queriedStudent := Student{Id: id}
	if err := s.Model(&queriedStudent).WherePK().Relation("Images").Select(); err != nil {
		return nil, richErrors.Wrap(err, "failed to find student")
	}
	return queriedStudent.Images, nil
}
