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

	url := "/" + lessonPlan.LessonPlanDetails.Class.School.Id + "/plans?date=" + lessonPlan.Date.Format(time.RFC3339)
	result := s.CreateRequest("GET", url, nil, &userId)
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
	assert.Equal(t, lessonPlan.LessonPlanDetails.Title, body[0].Title)
}
