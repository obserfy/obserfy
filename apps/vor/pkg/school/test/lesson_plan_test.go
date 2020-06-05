package school_test

import (
	"github.com/brianvoe/gofakeit/v4"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/stretchr/testify/assert"
	"net/http"
	"time"
)

func (s *SchoolTestSuite) TestGetLessonPlan() {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	lessonPlan, userId := s.SaveNewLessonPlan()

	result := s.CreateRequest("GET", "/"+lessonPlan.Details.Class.School.Id+"/plans?date="+lessonPlan.Date.Format("2006-01-02"), nil, &userId)
	assert.Equal(t, http.StatusOK, result.Code)

	type responseBody struct {
		Id          string    `json:"id"`
		Title       string    `json:"title"`
		Description string    `json:"description"`
		ClassName   string    `json:"className"`
		StartTime   time.Time `json:"startTime"`
	}
	var body []responseBody
	err := rest.ParseJson(result.Result().Body, &body)
	assert.NoError(t, err)

	assert.Len(t, body, 1)
	assert.Equal(t, *lessonPlan.Details.Title, body[0].Title)
}
