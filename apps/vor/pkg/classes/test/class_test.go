package class_test

import (
	"github.com/brianvoe/gofakeit/v4"
	"github.com/chrsep/vor/pkg/classes"
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
	s.Handler = classes.NewRouter(
		s.Server,
		postgres.ClassStore{s.DB},
		postgres.LessonPlanStore{s.DB},
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
		{newClass.Id, time.Sunday, newClass},
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
	original := s.SaveNewClass()
	result := s.CreateRequest("GET", "/"+original.Id, nil, nil)
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
	assert.Equal(t, original.Id, responseBody.Id)
	assert.Equal(t, original.Name, responseBody.Name)
	assert.Equal(t, len(original.Weekdays), len(responseBody.Weekdays))
	assert.Equal(t, original.EndTime.Unix(), responseBody.EndTime.Unix())
	assert.Equal(t, original.StartTime.Unix(), responseBody.StartTime.Unix())
}

func (s *ClassTestSuite) TestGetNonExistentClass() {
	t := s.T()
	result := s.CreateRequest("GET", "/"+uuid.New().String(), nil, nil)
	assert.Equal(t, http.StatusNotFound, result.Code)
}

func (s *ClassTestSuite) TestPatchClassName() {
	t := s.T()
	original := s.SaveNewClass()
	gofakeit.Seed(time.Now().UnixNano())

	payload := struct {
		Name string `json:"name"`
	}{gofakeit.Name()}
	result := s.CreateRequest("PATCH", "/"+original.Id, payload, nil)
	assert.Equal(t, http.StatusNoContent, result.Code)

	var updated postgres.Class
	err := s.DB.
		Model(&updated).
		Relation("Weekdays").
		Where("id=?", original.Id).
		Select()
	assert.NoError(t, err)
	assert.Equal(t, updated.Name, payload.Name)
	assert.Equal(t, updated.EndTime.Unix(), original.EndTime.Unix())
	assert.Equal(t, updated.StartTime.Unix(), original.StartTime.Unix())
	assert.Equal(t, len(updated.Weekdays), len(original.Weekdays))
	assert.Equal(t, updated.SchoolId, original.SchoolId)
}

func (s *ClassTestSuite) TestPatchClassAll() {
	t := s.T()
	original := s.SaveNewClass()
	gofakeit.Seed(time.Now().UnixNano())

	payload := struct {
		Name      string         `json:"name"`
		Weekdays  []time.Weekday `json:"weekdays"`
		StartTime time.Time      `json:"startTime"`
		EndTime   time.Time      `json:"endTime"`
	}{
		gofakeit.Name(),
		[]time.Weekday{
			time.Friday,
			time.Thursday,
			time.Monday,
		},
		time.Now(),
		time.Now().Add(time.Hour * 2),
	}
	result := s.CreateRequest("PATCH", "/"+original.Id, payload, nil)
	assert.Equal(t, http.StatusNoContent, result.Code)

	var updated postgres.Class
	err := s.DB.
		Model(&updated).
		Relation("Weekdays").
		Where("id=?", original.Id).
		Select()
	assert.NoError(t, err)
	assert.Equal(t, payload.Name, updated.Name)
	assert.Equal(t, payload.EndTime.Unix(), updated.EndTime.Unix())
	assert.Equal(t, payload.StartTime.Unix(), updated.StartTime.Unix())
	assert.Equal(t, len(payload.Weekdays), len(updated.Weekdays))
	assert.Equal(t, original.SchoolId, updated.SchoolId)
}

func (s *ClassTestSuite) TestPatchNonExistentClass() {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	payload := struct {
		Name string `json:"name"`
	}{gofakeit.Name()}

	result := s.CreateRequest("PATCH", "/"+uuid.New().String(), payload, nil)
	assert.Equal(t, http.StatusNotFound, result.Code)
}
