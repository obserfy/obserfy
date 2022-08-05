package domain

import (
	"github.com/google/uuid"
	"time"
)

// contains our core domain model

type Gender int

const (
	NotSet Gender = iota
	Male
	Female
)

const (
	RepetitionNone = iota
	RepetitionDaily
	RepetitionWeekly
	RepetitionMonthly
)

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

	Weekday struct {
		Day time.Weekday
	}

	Class struct {
		Id        string
		School    School
		Name      string
		StartTime time.Time
		EndTime   time.Time
		Weekdays  []Weekday
	}

	Student struct {
		Id           string
		Name         string
		DateOfBirth  *time.Time
		DateOfEntry  *time.Time
		Note         string
		CustomId     string
		Active       bool
		LessonPlans  []LessonPlan
		Images       []Image
		ProfileImage Image
		Guardians    []Guardian
		Classes      []Class
		School       School
		Gender       Gender
	}

	Guardian struct {
		Id       string
		Name     string
		Email    string
		Phone    string
		Note     string
		Address  string
		Children []Student
	}

	Video struct {
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
		Name  string
		Email string
	}

	School struct {
		Id    uuid.UUID
		Name  string
		Users []User
	}

	ProgressReport struct {
		Id              uuid.UUID
		Title           string
		PeriodStart     time.Time
		PeriodEnd       time.Time
		School          School
		StudentsReports []StudentReport
		Published       bool
	}

	StudentReport struct {
		ProgressReport  ProgressReport
		AreaComments    []StudentReportsAreaComment
		GeneralComments string
		Student         Student
		Ready           bool
		Assessments     []Assessments
	}

	Assessments struct {
		Student   Student
		Material  Material
		Stage     int
		UpdatedAt time.Time
	}

	StudentReportsAreaComment struct {
		Id uuid.UUID `json:"id"`

		StudentReportProgressReportId uuid.UUID
		StudentReportStudentId        uuid.UUID
		StudentReport                 StudentReport

		Area     Area
		Comments string
	}

	VideoStore interface {
		UpdateVideo(video Video) error
		DeleteVideo(id uuid.UUID) error
		GetVideo(id uuid.UUID) (Video, error)
		GetVideoSchool(videoId uuid.UUID) (School, error)
	}
)
