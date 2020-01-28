package student

import (
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/go-pg/pg/v9"
)

type Store interface {
	Get(studentId string) (*postgres.Student, error)
	Update(student *postgres.Student) error
	Delete(studentId string) error
	InsertObservation(studentId string, longDesc string, shortDesc string, category string) (*postgres.Observation, error)
	GetObservations(studentId string) ([]postgres.Observation, error)
	GetProgress(studentId string) ([]postgres.StudentMaterialProgress, error)
	UpdateProgress(progress postgres.StudentMaterialProgress) (pg.Result, error)
}
