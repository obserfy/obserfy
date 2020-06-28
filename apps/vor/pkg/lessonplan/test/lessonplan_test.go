package lessonplan_test

import (
	"github.com/brianvoe/gofakeit/v4"
	"github.com/chrsep/vor/pkg/lessonplan"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/chrsep/vor/pkg/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"net/http"
	"testing"
	"time"
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

func (s *LessonPlansTestSuite) TestPatchLessonPlan() {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	lessonPlan, userId := s.GenerateLessonPlan()

	result := s.CreateRequest("GET", "/"+lessonPlan.Id, nil, &userId)
	assert.Equal(t, result.Code, http.StatusOK)

	var responseBody struct {
		Id          string    `json:"id"`
		Title       string    `json:"title"`
		Description string    `json:"description"`
		ClassId     string    `json:"classId"`
		Date        time.Time `json:"date"`
		AreaId      string    `json:"areaId"`
		MaterialId  string    `json:"materialId"`
	}
	err := rest.ParseJson(result.Result().Body, &responseBody)
	assert.NoError(t, err)
	assert.Equal(t, lessonPlan.LessonPlanDetails.Title, responseBody.Title)
	assert.Equal(t, lessonPlan.LessonPlanDetails.Description, &responseBody.Description)
	assert.Equal(t, lessonPlan.LessonPlanDetails.MaterialId, responseBody.MaterialId)
	assert.Equal(t, lessonPlan.LessonPlanDetails.AreaId, responseBody.AreaId)
	assert.Equal(t, lessonPlan.Date.Unix(), responseBody.Date.Unix())
}
