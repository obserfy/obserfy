package school_test

import (
	"github.com/brianvoe/gofakeit/v4"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/school"
	"github.com/chrsep/vor/pkg/testutils"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"testing"
	"time"
)

type SchoolTestSuite struct {
	testutils.BaseTestSuite

	store postgres.SchoolStore
}

func (s *SchoolTestSuite) SetupTest() {
	s.store = postgres.SchoolStore{s.DB}
	s.Handler = school.NewRouter(s.Server, s.store).ServeHTTP
}

func TestObservation(t *testing.T) {
	suite.Run(t, new(SchoolTestSuite))
}

func (s *SchoolTestSuite) SaveNewClass(school postgres.School) *postgres.Class {
	t := s.T()
	newClass := postgres.Class{
		Id:        uuid.New().String(),
		SchoolId:  school.Id,
		School:    school,
		Name:      gofakeit.Name(),
		StartTime: time.Now(),
		EndTime:   time.Now(),
	}
	newClass.Weekdays = []postgres.Weekday{
		{newClass.Id, time.Sunday, newClass},
		{newClass.Id, time.Thursday, newClass},
		{newClass.Id, time.Friday, newClass},
	}
	err := s.DB.Insert(&newClass)
	assert.NoError(t, err)
	err = s.DB.Insert(&newClass.Weekdays)
	assert.NoError(t, err)
	return &newClass
}
