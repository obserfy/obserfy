package school

import (
	"time"

	"github.com/pkg/errors"
)

var (
	EmptyCurriculumError = errors.New("School doesn't have curriculum")
)

type (
	School struct {
		Id           string
		Name         string
		InviteCode   string
		Users        []*User
		CurriculumId string
		Curriculum   Curriculum
	}

	User struct {
		Id    string
		Email string
		Name  string
	}

	Attendance struct {
		Id        string
		StudentId string
		Class     Class
		Date      time.Time
	}

	Student struct {
		Id          string
		Name        string
		SchoolId    string
		ProfilePic  string
		DateOfBirth *time.Time
		Gender      Gender
		DateOfEntry *time.Time
		Note        string
		CustomId    string
		Active      bool
	}

	Gender int

	Class struct {
		Id        string
		Name      string
		StartTime time.Time
		EndTime   time.Time
		Students  []Student
		Weekdays  []Weekday
	}

	Weekday struct {
		Day time.Weekday
	}

	Curriculum struct {
		Id    string
		Name  string
		Areas []Area
	}

	Area struct {
		Id   string
		Name string
	}

	GuardianWithRelation struct {
		SchoolId     string
		Name         string
		Email        string
		Phone        string
		Note         string
		Relationship *int
		StudentId    *string
	}

	Guardian struct {
		Id           string
		SchoolId     string
		Name         string
		Email        string
		Phone        string
		Note         string
		Relationship *int
		StudentId    *string
	}
	LessonPlan struct {
		Id          string
		Title       string
		Description string
		ClassId     string
		ClassName   string
		StartTime   time.Time
		Files       []File
	}
	File struct {
		Id          string
		Name        string
		LessonPlans []LessonPlan
	}
	Store interface {
		NewSchool(schoolName, userId string) (*School, error)
		GetSchool(schoolId string) (*School, error)
		GetStudents(schoolId string) ([]Student, error)
		GetClassAttendance(classId, session string) ([]Attendance, error)
		NewStudent(student Student, classes []string, guardians map[string]int) error
		RefreshInviteCode(schoolId string) (*School, error)
		NewDefaultCurriculum(schoolId string) error
		DeleteCurriculum(schoolId string) error
		GetCurriculum(schoolId string) (*Curriculum, error)
		GetCurriculumAreas(schoolId string) ([]Area, error)
		NewClass(id string, name string, weekdays []time.Weekday, startTime, endTime time.Time) error
		GetSchoolClasses(schoolId string) ([]Class, error)
		InsertGuardianWithRelation(input GuardianWithRelation) (*Guardian, error)
		GetGuardians(schoolId string) ([]Guardian, error)
		GetLessonPlans(schoolId string, date string) ([]LessonPlan, error)
		GetLessonFiles(schoolId string) ([]File, error)
	}
)
