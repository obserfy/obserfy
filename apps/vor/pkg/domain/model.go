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
		Id    string
		Name  string
		Areas []Area
	}

	Area struct {
		Id       string
		Name     string
		Subjects []Subject
	}

	Subject struct {
		Id        string
		AreaId    string
		Name      string
		Order     int
		Materials []Material
	}

	Material struct {
		Id        string
		SubjectId string
		Subject   Subject
		Name      string
		Order     int
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

type Student struct {
	Id           string
	Name         string
	DateOfBirth  time.Time
	DateOfEntry  time.Time
	Note         string
	CustomId     string
	Active       bool
	LessonPlans  []LessonPlan
	Images       []Image
	ProfileImage Image
	Guardians    []Guardian
	//TODO: School         School
	//TODO: Classes        []Class
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
