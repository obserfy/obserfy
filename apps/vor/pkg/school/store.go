package school

import (
	"github.com/chrsep/vor/pkg/domain"
	"github.com/google/uuid"
	"github.com/pkg/errors"
	"mime/multipart"
	"time"
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
		Subscription Subscription
		CreatedAt    time.Time
	}

	Subscription struct {
		Id                 uuid.UUID
		CancelUrl          string
		Currency           string
		Email              string
		EventTime          time.Time
		NextBillDate       time.Time
		Status             string
		SubscriptionId     string
		SubscriptionPlanId string
		PaddleUserId       string
		UpdateUrl          string
		MarketingConsent   bool
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
		Id           string
		Name         string
		SchoolId     string
		DateOfBirth  *time.Time
		Gender       Gender
		DateOfEntry  *time.Time
		Note         string
		CustomId     string
		Active       bool
		Classes      []Class
		ProfileImage Image
	}

	Image struct {
		Id        string
		ObjectKey string
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
		Address      string
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
		Address      string
	}

	LessonPlan struct {
		Id          string
		Title       string
		Description string
		ClassId     string
		ClassName   string
		Date        time.Time
		Files       []File
		AreaId      string
		AreaName    string
		UserId      string
		UserName    string
	}

	File struct {
		Id          string
		Name        string
		LessonPlans []LessonPlan
	}

	Store interface {
		NewSchool(schoolName, userId string) (*School, error)
		GetSchool(schoolId string) (*School, error)
		GetStudents(schoolId, classId string, active *bool) ([]Student, error)
		GetClassAttendance(classId, session string) ([]Attendance, error)
		NewStudent(student Student, classes []string, guardians map[string]int) error
		RefreshInviteCode(schoolId string) (*School, error)
		NewDefaultCurriculum(schoolId string) error
		DeleteCurriculum(schoolId string) error
		GetCurriculum(schoolId string) (*Curriculum, error)
		GetCurriculumAreas(schoolId string) ([]Area, error)
		NewClass(id, name string, weekdays []time.Weekday, startTime, endTime time.Time) (string, error)
		GetSchoolClasses(schoolId string) ([]Class, error)
		InsertGuardianWithRelation(input GuardianWithRelation) (*Guardian, error)
		GetGuardians(schoolId string) ([]Guardian, error)
		CreateFile(schoolId string, file multipart.File, fileHeader *multipart.FileHeader) (*string, error)
		DeleteFile(fileId string) error
		UpdateFile(fileId, fileName string) (*File, error)
		GetLessonPlans(schoolId string, date time.Time) ([]LessonPlan, error)
		GetLessonFiles(schoolId string) ([]File, error)
		CreateLessonPlan(input domain.LessonPlan) (*domain.LessonPlan, error)
		CreateImage(schoolId string, image multipart.File, header *multipart.FileHeader) (string, error)
		GetUser(email string) (*User, error)
		DeleteUser(schoolId string, userId string) error
		NewCurriculum(schoolId string, name string) error
		CreateStudentVideo(schoolId string, studentId string, video domain.Video) error
		UpdateSchool(schoolId string, name *string) error
		NewProgressReport(
			schoolId string,
			title string,
			start time.Time,
			end time.Time,
			customStudents []string,
		) error
		GetReports(schoolId string) ([]domain.ProgressReport, error)
	}
	MailService interface {
		SendInviteEmail(email string, inviteCode string, schoolName string) error
	}
)
