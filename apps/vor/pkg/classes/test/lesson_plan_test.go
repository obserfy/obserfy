package class_test

import (
	"github.com/brianvoe/gofakeit/v4"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/stretchr/testify/assert"
	"net/http"
	"time"
)

func (s *ClassTestSuite) TestPostNewLessonPlan() {
	t := s.T()
	class := s.SaveNewClass()
	gofakeit.Seed(time.Now().UnixNano())

	type Payload struct {
		Title       string    `json:"title" validate:"required"`
		Description string    `json:"description"`
		Date        time.Time `json:"date" validate:"required"`
		FileIds     []string  `json:"fileIds"`
		Repetition  *struct {
			Type    int       `json:"type" validate:"oneof=0 1 2 3"`
			EndDate time.Time `json:"endDate" validate:"required"`
		} `json:"repetition,omitempty"`
	}

	payload := Payload{
		Title:       gofakeit.Name(),
		Description: gofakeit.Name(),
		Date:        gofakeit.Date(),
		Repetition:  nil,
	}
	result := s.CreateRequest("POST", "/"+class.Id+"/plans", payload, nil)
	assert.Equal(t, http.StatusCreated, result.Code)

	var plan postgres.LessonPlan
	err := s.DB.Model(&plan).
		Where("date=?", payload.Date).
		Relation("Details").
		Select()
	assert.NoError(t, err)
	assert.Equal(t, payload.Title, *plan.Details.Title)
	assert.Equal(t, payload.Description, *plan.Details.Description)
	assert.Equal(t, payload.Date.Unix(), plan.Date.Unix())
	assert.Equal(t, len(payload.FileIds), len(plan.Details.Files))
}
