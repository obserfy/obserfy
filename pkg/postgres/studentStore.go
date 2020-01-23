package postgres

import (
	"github.com/go-pg/pg/v9"
	"github.com/google/uuid"
	"time"
)

type StudentStore struct {
	*pg.DB
}

func (s StudentStore) InsertObservation(studentId string, longDesc string, shortDesc string, category string) (*Observation, error) {
	observationId := uuid.New()
	observation := Observation{
		Id:          observationId.String(),
		StudentId:   studentId,
		ShortDesc:   shortDesc,
		LongDesc:    longDesc,
		CategoryId:  category,
		CreatedDate: time.Now(),
	}
	if err := s.Insert(&observation); err != nil {
		return nil, err
	}
	return &observation, nil
}

func (s StudentStore) GetObservations(studentId string) ([]Observation, error) {
	var observations []Observation
	if err := s.Model(&observations).
		Where("student_id=?", studentId).
		Order("created_date").
		Select(); err != nil {
		return nil, err
	}
	return observations, nil
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
