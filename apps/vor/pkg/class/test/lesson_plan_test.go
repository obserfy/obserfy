package class_test

import (
	"github.com/brianvoe/gofakeit/v4"
	"github.com/chrsep/vor/pkg/lessonplan"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/stretchr/testify/assert"
	"net/http"
	"testing"
	"time"
)

type postNewPlanPayload struct {
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Date        time.Time `json:"date" `
	FileIds     []string  `json:"fileIds"`
	MaterialId  string    `json:"materialId"`
	AreaId      string    `json:"areaId"`
	Repetition  *struct {
		Type    int       `json:"type"`
		EndDate time.Time `json:"endDate"`
	} `json:"repetition,omitempty"`
	Students []string `json:"students"`
}

func (s *ClassTestSuite) TestPostNewLessonPlan() {
	t := s.T()
	class := s.SaveNewClass()
	gofakeit.Seed(time.Now().UnixNano())

	payload := postNewPlanPayload{
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
		Relation("LessonPlanDetails").
		Select()
	assert.NoError(t, err)
	assert.Equal(t, payload.Title, plan.LessonPlanDetails.Title)
	assert.Equal(t, payload.Description, *plan.LessonPlanDetails.Description)
	assert.Equal(t, payload.Date.Unix(), plan.Date.Unix())
	assert.Equal(t, len(payload.FileIds), len(plan.LessonPlanDetails.Files))
}

func (s *ClassTestSuite) TestPostNewLessonPlanWithRepetition() {
	t := s.T()
	class := s.SaveNewClass()
	gofakeit.Seed(time.Now().UnixNano())
	date := gofakeit.Date()

	tests := []struct {
		name    string
		payload postNewPlanPayload
		count   int
		dates   []time.Time
	}{
		{
			"none",
			postNewPlanPayload{
				Title:       gofakeit.Name(),
				Description: gofakeit.Name(),
				Date:        date,
				Repetition: &struct {
					Type    int       `json:"type"`
					EndDate time.Time `json:"endDate"`
				}{
					Type:    lessonplan.RepetitionNone,
					EndDate: date.Add(32 * 24 * time.Hour),
				},
			},
			1,
			[]time.Time{date},
		},
		{
			"daily",
			postNewPlanPayload{
				Title:       gofakeit.Name(),
				Description: gofakeit.Name(),
				Date:        date,
				Repetition: &struct {
					Type    int       `json:"type"`
					EndDate time.Time `json:"endDate"`
				}{
					Type:    lessonplan.RepetitionDaily,
					EndDate: date.Add(3 * 24 * time.Hour),
				},
			},
			4,
			[]time.Time{
				date,
				date.AddDate(0, 0, 1),
				date.AddDate(0, 0, 2),
				date.AddDate(0, 0, 3),
			},
		},
		{
			"weekly",
			postNewPlanPayload{
				Title:       gofakeit.Name(),
				Description: gofakeit.Name(),
				Date:        date,
				Repetition: &struct {
					Type    int       `json:"type"`
					EndDate time.Time `json:"endDate"`
				}{
					Type:    lessonplan.RepetitionWeekly,
					EndDate: date.Add(32 * 24 * time.Hour),
				},
			},
			5,
			[]time.Time{
				date,
				date.AddDate(0, 0, 7),
				date.AddDate(0, 0, 14),
				date.AddDate(0, 0, 21),
				date.AddDate(0, 0, 28),
			},
		},
		{
			"monthly",
			postNewPlanPayload{
				Title:       gofakeit.Name(),
				Description: gofakeit.Name(),
				Date:        date,
				Repetition: &struct {
					Type    int       `json:"type"`
					EndDate time.Time `json:"endDate"`
				}{
					Type:    lessonplan.RepetitionMonthly,
					EndDate: date.Add(32 * 24 * time.Hour),
				},
			},
			2,
			[]time.Time{
				date,
				date.AddDate(0, 1, 0),
			},
		},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			result := s.CreateRequest("POST", "/"+class.Id+"/plans", test.payload, nil)
			assert.Equal(t, http.StatusCreated, result.Code)

			var plans postgres.LessonPlanDetails
			err := s.DB.Model(&plans).
				Where("title=?", test.payload.Title).
				Relation("LessonPlans").
				Select()
			assert.NoError(t, err)
			assert.Len(t, plans.LessonPlans, test.count)

			for i := range test.dates {
				assert.Equal(t, test.dates[i].Unix(), plans.LessonPlans[i].Date.Unix())
			}
		})
	}
}

func (s *ClassTestSuite) TestPostNewLessonPlanWithCurriculumData() {
	t := s.T()
	material, userId := s.GenerateMaterial()
	area := material.Subject.Area
	school := area.Curriculum.Schools[0]
	class := s.GenerateClass(school)

	student := s.GenerateStudent(&school)

	gofakeit.Seed(time.Now().UnixNano())
	date := gofakeit.Date()

	tests := []struct {
		name    string
		payload postNewPlanPayload
		count   int
	}{
		{
			"none",
			postNewPlanPayload{
				Title:       gofakeit.Name(),
				Description: gofakeit.Name(),
				Date:        date,
				Repetition: &struct {
					Type    int       `json:"type"`
					EndDate time.Time `json:"endDate"`
				}{
					Type:    lessonplan.RepetitionNone,
					EndDate: date.Add(32 * 24 * time.Hour),
				},
				AreaId:     area.Id,
				MaterialId: material.Id,
				Students:   []string{student.Id},
			},
			1,
		},
		{
			"daily",
			postNewPlanPayload{
				Title:       gofakeit.Name(),
				Description: gofakeit.Name(),
				Date:        date,
				Repetition: &struct {
					Type    int       `json:"type"`
					EndDate time.Time `json:"endDate"`
				}{
					Type:    lessonplan.RepetitionDaily,
					EndDate: date.Add(3 * 24 * time.Hour),
				},
				AreaId:     area.Id,
				MaterialId: material.Id,
				Students:   []string{student.Id},
			},
			4,
		},
		{
			"monthly",
			postNewPlanPayload{
				Title:       gofakeit.Name(),
				Description: gofakeit.Name(),
				Date:        date,
				Repetition: &struct {
					Type    int       `json:"type"`
					EndDate time.Time `json:"endDate"`
				}{
					Type:    lessonplan.RepetitionMonthly,
					EndDate: date.Add(32 * 24 * time.Hour),
				},
				AreaId:     area.Id,
				MaterialId: material.Id,
				Students:   []string{student.Id},
			},
			2,
		},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			result := s.CreateRequest("POST", "/"+class.Id+"/plans", test.payload, &userId)
			assert.Equal(t, http.StatusCreated, result.Code)

			var plans postgres.LessonPlanDetails
			err := s.DB.Model(&plans).
				Where("title=?", test.payload.Title).
				Relation("LessonPlans").
				Relation("Students").
				Select()
			assert.NoError(t, err)
			assert.Len(t, plans.LessonPlans, test.count)
			assert.Equal(t, plans.AreaId, test.payload.AreaId)
			assert.Equal(t, plans.MaterialId, test.payload.MaterialId)
			assert.Len(t, plans.Students, len(test.payload.Students))
		})
	}
}
