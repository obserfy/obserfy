package class_test

import (
	"github.com/brianvoe/gofakeit/v4"
	"github.com/chrsep/vor/pkg/class"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/chrsep/vor/pkg/testutils"
	"github.com/go-pg/pg/v9"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"net/http"
	"testing"
	"time"
)

type ClassTestSuite struct {
	testutils.BaseTestSuite
}

func (s *ClassTestSuite) SetupTest() {
	s.Handler = class.NewRouter(
		s.Server,
		postgres.ClassStore{s.DB},
	).ServeHTTP
}

func TestClass(t *testing.T) {
	suite.Run(t, new(ClassTestSuite))
}

func (s *ClassTestSuite) SaveNewClass() *postgres.Class {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	newUser := postgres.User{Id: uuid.New().String()}
	newSchool := postgres.School{
		Id:           uuid.New().String(),
		Name:         gofakeit.Name(),
		InviteCode:   uuid.New().String(),
		Users:        []postgres.User{},
		CurriculumId: "",
		Curriculum:   postgres.Curriculum{},
	}
	newSchool.Users = []postgres.User{newUser}
	schoolUserRelation := postgres.UserToSchool{
		SchoolId: newSchool.Id,
		UserId:   newUser.Id,
	}
	newClass := postgres.Class{
		Id:        uuid.New().String(),
		SchoolId:  newSchool.Id,
		School:    newSchool,
		Name:      gofakeit.Name(),
		StartTime: time.Now(),
		EndTime:   time.Now(),
	}
	newClass.Weekdays = []postgres.Weekday{
		{newClass.Id, time.Thursday, newClass},
		{newClass.Id, time.Friday, newClass},
	}
	err := s.DB.Insert(&newUser)
	assert.NoError(t, err)
	err = s.DB.Insert(&newSchool)
	assert.NoError(t, err)
	err = s.DB.Insert(&schoolUserRelation)
	assert.NoError(t, err)
	err = s.DB.Insert(&newClass)
	assert.NoError(t, err)
	err = s.DB.Insert(&newClass.Weekdays)
	assert.NoError(t, err)
	return &newClass
}

func (s *ClassTestSuite) TestDeleteClass() {
	t := s.T()
	newClass := s.SaveNewClass()
	result := s.CreateRequest("DELETE", "/"+newClass.Id, nil, nil)
	assert.Equal(t, http.StatusOK, result.Code)

	var deletedClass postgres.Class
	err := s.DB.Model(&deletedClass).Where("id=?", newClass.Id).Select()
	assert.EqualError(t, err, pg.ErrNoRows.Error())
}

func (s *ClassTestSuite) TestDeleteNonExistentClass() {
	t := s.T()
	result := s.CreateRequest("DELETE", "/"+uuid.New().String(), nil, nil)
	assert.Equal(t, http.StatusNotFound, result.Code)
}

func (s *ClassTestSuite) TestGetClass() {
	t := s.T()
	newClass := s.SaveNewClass()
	result := s.CreateRequest("GET", "/"+newClass.Id, nil, nil)
	assert.Equal(t, http.StatusOK, result.Code)

	var responseBody struct {
		Id        string         `json:"id"`
		Name      string         `json:"name"`
		Weekdays  []time.Weekday `json:"weekdays"`
		StartTime time.Time      `json:"startTime"`
		EndTime   time.Time      `json:"endTime"`
	}
	err := rest.ParseJson(result.Result().Body, &responseBody)
	assert.NoError(t, err)
	assert.Equal(t, newClass.Id, responseBody.Id)
	assert.Equal(t, newClass.Name, responseBody.Name)
	assert.Equal(t, len(newClass.Weekdays), len(responseBody.Weekdays))
	assert.Equal(t, newClass.EndTime.Unix(), responseBody.EndTime.Unix())
	assert.Equal(t, newClass.StartTime.Unix(), responseBody.StartTime.Unix())
}
