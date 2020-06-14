package postgres

import (
	richErrors "github.com/pkg/errors"
	"time"

	"github.com/go-pg/pg/v9"
	"github.com/go-pg/pg/v9/orm"
	"github.com/google/uuid"
)

type StudentStore struct {
	*pg.DB
}

func (s StudentStore) NewClassRelation(studentId string, classId string) error {
	relation := StudentToClass{ClassId: classId, StudentId: studentId}
	if err := s.Insert(&relation); err != nil {
		return richErrors.Wrap(err, "failed to save class to student relation")
	}
	return nil
}

func (s StudentStore) DeleteClassRelation(studentId string, classId string) error {
	relation := StudentToClass{ClassId: classId, StudentId: studentId}
	if err := s.Delete(&relation); err != nil {
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
	eventTime *time.Time,
) (*Observation, error) {
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
	}
	if err := s.Insert(&observation); err != nil {
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
	if err := s.Insert(&attendance); err != nil {
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

func (s StudentStore) UpdateProgress(progress StudentMaterialProgress) (pg.Result, error) {
	return s.Model(&progress).OnConflict("(material_id, student_id) DO UPDATE").Insert()
}

func (s StudentStore) Get(studentId string) (*Student, error) {
	var student Student
	if err := s.DB.Model(&student).
		Where("id=?", studentId).
		Relation("Guardians").
		Relation("Classes").
		Select(); err != nil {
		return nil, err
	}
	return &student, nil
}

func (s StudentStore) UpdateStudent(student *Student) error {
	if _, err := s.DB.Model(student).
		WherePK().UpdateNotZero(); err != nil {
		return richErrors.Wrap(err, "failed to update student")
	}
	return nil
}

func (s StudentStore) DeleteStudent(studentId string) error {
	student := Student{Id: studentId}
	return s.DB.Delete(&student)
}

func (s StudentStore) InsertGuardianRelation(studentId string, guardianId string, relationship int) error {
	relation := GuardianToStudent{
		StudentId:    studentId,
		GuardianId:   guardianId,
		Relationship: GuardianRelationship(relationship),
	}
	if err := s.Insert(&relation); err != nil {
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
