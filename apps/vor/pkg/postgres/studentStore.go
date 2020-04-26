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
func (s StudentStore) InsertAttendance(studentId string, classId string) (*Attendance, error) {
	attendanceId := uuid.New()
	attendance := Attendance{
		Id:        attendanceId.String(),
		StudentId: studentId,
		ClassId:   classId,
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
		Select(); err != nil {
		return nil, err
	}
	return &student, nil
}

func (s StudentStore) Update(student *Student) error {
	return s.DB.Update(student)
}

func (s StudentStore) Delete(studentId string) error {
	student := Student{Id: studentId}
	return s.DB.Delete(&student)
}
