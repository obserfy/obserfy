package domain

import (
	"github.com/google/uuid"
	"time"
)

// contains our core domain model
type (
	Image struct {
		Id        uuid.UUID
		ObjectKey string
		CreatedAt time.Time
	}

	Observation struct {
		Id                 string
		StudentId          string
		StudentName        string
		ShortDesc          string
		LongDesc           string
		CategoryId         string
		CreatedDate        time.Time
		EventTime          time.Time
		CreatorId          string
		CreatorName        string
		Images             []Image
		Area               Area
		VisibleToGuardians bool
	}

	// Curriculum data
	Curriculum struct {
		Id          string
		Name        string
		Areas       []Area
		Description string
	}

	Area struct {
		Id          string
		Name        string
		Subjects    []Subject
		Description string
	}

	Subject struct {
		Id          string
		AreaId      string
		Name        string
		Order       int
		Materials   []Material
		Description string
	}

	Material struct {
		Id          string
		SubjectId   string
		Subject     Subject
		Name        string
		Order       int
		Description string
	}
)

const (
	RepetitionNone = iota
	RepetitionDaily
	RepetitionWeekly
	RepetitionMonthly
)

type (
	RepetitionPattern struct {
		Type    int
		EndDate time.Time
	}

	LessonPlan struct {
		Id          string
		Title       string
		Description string
		ClassId     string
		SchoolId    string
		FileIds     []string
		Date        time.Time
		Repetition  RepetitionPattern
		AreaId      string
		MaterialId  string
		Links       []Link
		Students    []Student
		UserId      string
	}

	Link struct {
		Id          uuid.UUID
		Url         string
		Image       string
		Title       string
		Description string
	}
)

type Weekday struct {
	Day time.Weekday `json:"day"`
}

type Class struct {
	Id        string    `json:"id"`
	School    School    `json:"school"`
	Name      string    `json:"name"`
	StartTime time.Time `json:"startTime"`
	EndTime   time.Time `json:"endTime"`
	Weekdays  []Weekday `json:"weekdays"`
}

type Student struct {
	Id           string       `json:"id"`
	Name         string       `json:"name"`
	DateOfBirth  time.Time    `json:"dateOfBirth"`
	DateOfEntry  time.Time    `json:"dateOfEntry"`
	Note         string       `json:"note"`
	CustomId     string       `json:"customId"`
	Active       bool         `json:"active"`
	LessonPlans  []LessonPlan `json:"lessonPlans"`
	Images       []Image      `json:"images"`
	ProfileImage Image        `json:"profileImage"`
	Guardians    []Guardian   `json:"guardians"`
	Classes      []Class      `json:"classes"`
	//TODO: School         School
	//TODO: Gender         Gender
}

type Guardian struct {
	Id       string
	Name     string
	Email    string
	Phone    string
	Note     string
	Address  string
	Children []Student
}

type Video struct {
	Id            uuid.UUID
	UploadUrl     string
	UploadId      string
	Status        string
	UploadTimeout int32
	CreatedAt     time.Time
	UserId        string
	SchoolId      string
	AssetId       string
	PlaybackId    string
	PlaybackUrl   string
	ThumbnailUrl  string
	School        School
}

type Subscription struct {
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

type User struct {
	Id    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

type School struct {
	Id    uuid.UUID `json:"id"`
	Name  string    `json:"name"`
	Users []User    `json:"users"`
}

type ProgressReport struct {
	Id              uuid.UUID       `json:"id"`
	Title           string          `json:"title"`
	PeriodStart     time.Time       `json:"periodStart"`
	PeriodEnd       time.Time       `json:"periodEnd"`
	School          *School         `json:"school,omitempty"`
	StudentsReports []StudentReport `json:"studentsReports"`
}

type StudentReport struct {
	ProgressReport  ProgressReport              `json:"progressReport"`
	AreaComments    []StudentReportsAreaComment `json:"areaComments"`
	GeneralComments string                      `json:"generalComments"`
	Ready           bool                        `json:"ready"`
	Student         Student                     `json:"student"`
}

type StudentReportsAreaComment struct {
	Id uuid.UUID `json:"id"`

	StudentReportProgressReportId uuid.UUID     `json:"studentReportProgressReportId"`
	StudentReportStudentId        uuid.UUID     `json:"studentReportsId"`
	StudentReport                 StudentReport `json:"studentReport"`

	Area     Area   `json:"area"`
	Comments string `json:"comments"`
	Ready    bool   `json:"ready"`
}

type VideoStore interface {
	UpdateVideo(video Video) error
	DeleteVideo(id uuid.UUID) error
	GetVideo(id uuid.UUID) (Video, error)
	GetVideoSchool(videoId uuid.UUID) (School, error)
}
