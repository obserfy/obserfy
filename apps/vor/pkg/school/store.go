package school

import (
	"time"

	"github.com/chrsep/vor/pkg/postgres"
)

type Store interface {
	NewSchool(schoolName, userId string) (*postgres.School, error)
	GetSchool(schoolId string) (*postgres.School, error)
	GetStudents(schoolId string) ([]postgres.Student, error)
	GetClassAttendance(classId, session string) ([]postgres.Attendance, error)
	NewStudent(student postgres.Student, classes []string, guardians map[string]int) error
	RefreshInviteCode(schoolId string) (*postgres.School, error)
	NewDefaultCurriculum(schoolId string) error
	DeleteCurriculum(schoolId string) error
	GetCurriculum(schoolId string) (*postgres.Curriculum, error)
	GetCurriculumAreas(schoolId string) ([]postgres.Area, error)
	NewClass(id string, name string, weekdays []time.Weekday, startTime, endTime time.Time) error
	GetSchoolClasses(schoolId string) ([]postgres.Class, error)
	InsertGuardianWithRelation(input postgres.GuardianRelation) (*postgres.Guardian, error)
	GetGuardians(schoolId string) ([]postgres.Guardian, error)
}