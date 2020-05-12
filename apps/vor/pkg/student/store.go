package student

import (
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/go-pg/pg/v9"
	"time"
)

type Store interface {
	InsertObservation(
		studentId string,
		creatorId string,
		longDesc string,
		shortDesc string,
		category string,
		eventTime *time.Time,
	) (*postgres.Observation, error)
	GetObservations(studentId string) ([]postgres.Observation, error)
	GetProgress(studentId string) ([]postgres.StudentMaterialProgress, error)
	UpdateProgress(progress postgres.StudentMaterialProgress) (pg.Result, error)
	Get(studentId string) (*postgres.Student, error)
	UpdateStudent(student *postgres.Student) error
	DeleteStudent(studentId string) error
	CheckPermissions(studentId string, userId string) (bool, error)
	InsertAttendance(studentId string, classId string,date time.Time) (*postgres.Attendance, error)
	GetAttendance(studentId string) ([]postgres.Attendance, error)
	InsertGuardianRelation(studentId string, guardianId string, relationship int) error
	DeleteGuardianRelation(studentId string, guardianId string) error
	GetGuardianRelation(studentId string, guardianId string) (*postgres.GuardianToStudent, error)
}
