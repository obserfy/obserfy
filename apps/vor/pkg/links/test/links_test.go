package lessonplan_test

import (
	"github.com/chrsep/vor/pkg/links"
	"github.com/go-pg/pg/v10"
	"net/http"
	"testing"
	"time"

	"github.com/brianvoe/gofakeit/v4"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"

	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/testutils"
)

type LinksTestSuite struct {
	testutils.BaseTestSuite

	store links.Store
}

func (s *LinksTestSuite) SetupTest() {
	s.store = postgres.LinksStore{s.DB}
	s.Handler = links.NewRouter(s.Server, s.store).ServeHTTP
}

func TestLessonPlans(t *testing.T) {
	suite.Run(t, new(LinksTestSuite))
}

func (s *LinksTestSuite) TestDeleteLink() {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	lessonPlan, userId := s.GenerateLessonPlan(nil)
	link := s.GenerateLessonPlanLink(lessonPlan.LessonPlanDetails)

	result := s.CreateRequest("DELETE", "/"+link.Id.String(), nil, &userId)
	assert.Equal(t, result.Code, http.StatusOK)

	savedLink := postgres.LessonPlanLink{Id: link.Id}
	err := s.DB.Model(&savedLink).WherePK().Select()
	assert.Error(t, err, pg.ErrNoRows)
}

func (s *LinksTestSuite) TestPatchLink() {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	lessonPlan, userId := s.GenerateLessonPlan(nil)

	type Payload struct {
		Url         string `json:"url,omitempty"`
		Image       string `json:"image,omitempty"`
		Title       string `json:"title,omitempty"`
		Description string `json:"description,omitempty"`
	}
	tests := []struct {
		name    string
		payload Payload
	}{
		{"title", Payload{Title: gofakeit.Name()}},
		{"description", Payload{Description: gofakeit.Name()}},
		{"url", Payload{Url: gofakeit.URL()}},
		{"image", Payload{Image: gofakeit.ImageURL(10, 10)}},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			link := s.GenerateLessonPlanLink(lessonPlan.LessonPlanDetails)
			result := s.CreateRequest("PATCH", "/"+link.Id.String(), test.payload, &userId)
			assert.Equal(t, http.StatusNoContent, result.Code)

			updatedLink := postgres.LessonPlanLink{Id: link.Id}
			err := s.DB.Model(&updatedLink).WherePK().Select()
			assert.NoError(t, err)

			if test.payload.Title != "" {
				assert.Equal(t, test.payload.Title, updatedLink.Title)
			} else {
				assert.Equal(t, link.Title, updatedLink.Title)
			}
			if test.payload.Description != "" {
				assert.Equal(t, test.payload.Description, updatedLink.Description)
			} else {
				assert.Equal(t, link.Description, updatedLink.Description)
			}
			if test.payload.Image != "" {
				assert.Equal(t, test.payload.Image, updatedLink.Image)
			} else {
				assert.Equal(t, link.Image, updatedLink.Image)
			}
			if test.payload.Url != "" {
				assert.Equal(t, test.payload.Url, updatedLink.Url)
			} else {
				assert.Equal(t, link.Url, updatedLink.Url)
			}
		})
	}
}
