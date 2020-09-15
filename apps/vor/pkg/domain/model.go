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
		Id          string
		StudentId   string
		StudentName string
		ShortDesc   string
		LongDesc    string
		CategoryId  string
		CreatedDate time.Time
		EventTime   time.Time
		CreatorId   string
		CreatorName string
		Images      []Image
		Area        Area
	}

	// Curriculum data
	Area struct {
		Id   string
		Name string
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
