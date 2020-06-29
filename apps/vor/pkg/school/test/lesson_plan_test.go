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
	lessonPlan, userId := s.GenerateLessonPlan()

	url := "/" + lessonPlan.LessonPlanDetails.Class.SchoolId + "/plans?date=" + lessonPlan.Date.Format(time.RFC3339)
	result := s.CreateRequest("GET", url, nil, &userId)
	assert.Equal(t, http.StatusOK, result.Code)

	type responseBody struct {
		Id          string `json:"id"`
		Title       string `json:"title"`
		Description string `json:"description"`
		ClassName   string `json:"className"`
		Area        struct {
			Id   string `json:"id"`
			Name string `json:"name"`
		} `json:"area,omitempty"`
	}
	var body []responseBody
	err := rest.ParseJson(result.Result().Body, &body)
	assert.NoError(t, err)

	assert.Len(t, body, 1)
	assert.Equal(t, lessonPlan.LessonPlanDetails.Title, body[0].Title)
	assert.Equal(t, *lessonPlan.LessonPlanDetails.Description, body[0].Description)
	assert.Equal(t, lessonPlan.LessonPlanDetails.Class.Name, body[0].ClassName)
	assert.Equal(t, lessonPlan.LessonPlanDetails.Area.Name, body[0].Area.Name)
	assert.Equal(t, lessonPlan.LessonPlanDetails.Area.Id, body[0].Area.Id)
}
