package lessonplan_test

import (
	"github.com/google/uuid"
	"net/http"
	"testing"
	"time"

	"github.com/brianvoe/gofakeit/v4"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"

	"github.com/chrsep/vor/pkg/lessonplan"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/chrsep/vor/pkg/testutils"
)

type LessonPlansTestSuite struct {
	testutils.BaseTestSuite

	store lessonplan.Store
}

func (s *LessonPlansTestSuite) SetupTest() {
	s.store = postgres.LessonPlanStore{s.DB}
	s.Handler = lessonplan.NewRouter(s.Server, s.store).ServeHTTP
}

func TestLessonPlans(t *testing.T) {
	suite.Run(t, new(LessonPlansTestSuite))
}

func (s *LessonPlansTestSuite) TestGetLessonPlan() {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	lessonPlan, userId := s.GenerateLessonPlan(nil)

	result := s.CreateRequest("GET", "/"+lessonPlan.Id, nil, &userId)
	assert.Equal(t, result.Code, http.StatusOK)

	type link struct {
		Id          uuid.UUID `json:"id"`
		Url         string    `json:"url"`
		Image       string    `json:"image"`
		Title       string    `json:"title"`
		Description string    `json:"description"`
	}
	var responseBody struct {
		Id          string    `json:"id"`
		Title       string    `json:"title"`
		Description string    `json:"description"`
		ClassId     string    `json:"classId"`
		Date        time.Time `json:"date"`
		AreaId      string    `json:"areaId"`
		MaterialId  string    `json:"materialId"`
		Links       []link    `json:"links"`
	}
	err := rest.ParseJson(result.Result().Body, &responseBody)
	assert.NoError(t, err)
	assert.Equal(t, lessonPlan.LessonPlanDetails.Title, responseBody.Title)
	assert.Equal(t, lessonPlan.LessonPlanDetails.Description, responseBody.Description)
	assert.Equal(t, lessonPlan.LessonPlanDetails.MaterialId, responseBody.MaterialId)
	assert.Equal(t, lessonPlan.LessonPlanDetails.AreaId, responseBody.AreaId)
	assert.Equal(t, lessonPlan.Date.Unix(), responseBody.Date.Unix())
	assert.Equal(t, len(lessonPlan.LessonPlanDetails.Links), len(responseBody.Links))
}

func (s *LessonPlansTestSuite) TestPatchLessonPlan() {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	lessonPlan, userId := s.GenerateLessonPlan(nil)

	type Payload struct {
		Title       string     `json:"title,omitempty"`
		Description string     `json:"description,omitempty"`
		Date        *time.Time `json:"date,omitempty"`
		AreaId      string     `json:"areaId,omitempty"`
		MaterialId  string     `json:"materialId,omitempty"`
	}
	anotherArea, _ := s.GenerateArea(nil)
	anotherMaterial, _ := s.GenerateMaterial(nil)
	tests := []struct {
		name    string
		payload Payload
	}{
		{"title", Payload{Title: gofakeit.Name()}},
		{"description", Payload{Description: gofakeit.Name()}},
		{"date", Payload{Date: randomDatePointer()}},
		// TODO: These are material and area from a different school, we probably shouldn't allow
		// 	this to succeed.
		{"AreaId", Payload{AreaId: anotherArea.Id}},
		{"MaterialId", Payload{MaterialId: anotherMaterial.Id}},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			result := s.CreateRequest("PATCH", "/"+lessonPlan.Id, test.payload, &userId)
			assert.Equal(t, http.StatusNoContent, result.Code)

			updatedLessonPlan := postgres.LessonPlanDetails{Id: lessonPlan.LessonPlanDetailsId}
			err := s.DB.Model(&updatedLessonPlan).Relation("LessonPlans").WherePK().Select()
			assert.NoError(t, err)

			if test.payload.Title != "" {
				assert.Equal(t, test.payload.Title, updatedLessonPlan.Title)
			}
			if test.payload.Description != "" {
				assert.Equal(t, test.payload.Description, updatedLessonPlan.Description)
			}
			if test.payload.Date != nil {
				assert.Equal(t, test.payload.Date.Unix(), updatedLessonPlan.LessonPlans[0].Date.Unix())
			}

			if test.payload.AreaId != "" {
				assert.Equal(t, test.payload.AreaId, updatedLessonPlan.AreaId)
			}
			if test.payload.MaterialId != "" {
				assert.Equal(t, test.payload.MaterialId, updatedLessonPlan.MaterialId)
			}
		})
	}
}

func (s *LessonPlansTestSuite) TestPostNewLinks() {
	t := s.T()
	lessonPlan, userId := s.GenerateLessonPlan(nil)
	gofakeit.Seed(time.Now().UnixNano())

	type payload struct {
		Url         string `json:"url"`
		Image       string `json:"image"`
		Title       string `json:"title"`
		Description string `json:"description"`
	}
	result := s.CreateRequest("POST", "/"+lessonPlan.Id+"/links", payload{
		Url:         gofakeit.URL(),
		Image:       gofakeit.ImageURL(10, 10),
		Title:       gofakeit.Name(),
		Description: gofakeit.Name(),
	}, &userId)
	assert.Equal(t, http.StatusCreated, result.Code)

	updatedLessonPlan := postgres.LessonPlan{Id: lessonPlan.Id}
	err := s.DB.Model(&updatedLessonPlan).
		Relation("LessonPlanDetails").
		Relation("LessonPlanDetails.Links").
		WherePK().
		Select()
	assert.NoError(t, err)
	assert.Len(t, updatedLessonPlan.LessonPlanDetails.Links, 2)
}

func (s *LessonPlansTestSuite) TestPostNewLessonPlanRelatedStudent() {
	t := s.T()
	school, _ := s.GenerateSchool()
	lessonPlan, userId := s.GenerateLessonPlan(school)
	students := []*postgres.Student{
		s.GenerateStudent(school),
		s.GenerateStudent(school),
		s.GenerateStudent(school),
		s.GenerateStudent(school),
	}
	gofakeit.Seed(time.Now().UnixNano())

	var payload struct {
		StudentIds []uuid.UUID `json:"studentIds"`
	}
	for _, student := range students {
		payload.StudentIds = append(payload.StudentIds, uuid.MustParse(student.Id))
	}
	result := s.CreateRequest("POST", "/"+lessonPlan.Id+"/students", payload, &userId)
	assert.Equal(t, http.StatusCreated, result.Code)

	updatedLessonPlan := postgres.LessonPlan{Id: lessonPlan.Id}
	err := s.DB.Model(&updatedLessonPlan).
		Relation("Students").
		Relation("LessonPlanDetails").
		Relation("LessonPlanDetails.Links").
		WherePK().
		Select()
	assert.NoError(t, err)
	assert.Equal(t, len(students)+1, len(updatedLessonPlan.Students))
}

func (s *LessonPlansTestSuite) TestDeleteLessonPlanRelatedStudent() {
	t := s.T()
	school, _ := s.GenerateSchool()
	lessonPlan, userId := s.GenerateLessonPlan(school)
	gofakeit.Seed(time.Now().UnixNano())

	result := s.CreateRequest("DELETE", "/"+lessonPlan.Id+"/students/"+lessonPlan.Students[0].Id, nil, &userId)
	assert.Equal(t, http.StatusOK, result.Code)

	updatedLessonPlan := postgres.LessonPlan{Id: lessonPlan.Id}
	err := s.DB.Model(&updatedLessonPlan).
		Relation("Students").
		Relation("LessonPlanDetails").
		Relation("LessonPlanDetails.Links").
		WherePK().
		Select()
	assert.NoError(t, err)
	assert.Equal(t, 0, len(updatedLessonPlan.Students))
}

func randomDatePointer() *time.Time {
	date := gofakeit.Date()
	return &date
}
