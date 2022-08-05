package exports_test

import (
	"github.com/chrsep/vor/pkg/exports"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/testutils"
	"github.com/gocarina/gocsv"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"net/http"
	"testing"
)

type ImagesTestSuite struct {
	testutils.BaseTestSuite
	store exports.Store
}

func (s *ImagesTestSuite) SetupTest() {
	s.store = postgres.ExportsStore{DB: s.DB}
	s.Handler = exports.NewRouter(s.Server, s.store).ServeHTTP
}

func TestImagesApi(t *testing.T) {
	suite.Run(t, new(ImagesTestSuite))
}

func (s *ImagesTestSuite) TestObservationExport() {
	t := s.T()
	observation := s.GenerateObservation()

	result := s.CreateRequest("GET", "/"+observation.Student.School.Id+"/observations?studentId="+observation.StudentId+"&", nil, &observation.Student.School.Users[0].Id)
	assert.Equal(t, result.Code, http.StatusOK)

	type responseBody struct {
		Date      string `csv:"Date"`
		Area      string `csv:"Area"`
		ShortDesc string `csv:"Short Description"`
		Details   string `csv:"Details"`
	}
	body := make([]responseBody, 0)
	err := gocsv.UnmarshalBytes(result.Body.Bytes(), &body)
	assert.NoError(t, err)
	assert.Len(t, body, 1)
	assert.Equal(t, body[0].Details, observation.LongDesc)
	assert.Equal(t, body[0].ShortDesc, observation.ShortDesc)
}

func (s *ImagesTestSuite) TestUnauthorizedObservationExport() {
	t := s.T()
	observation := s.GenerateObservation()
	school, _ := s.GenerateSchool()

	result := s.CreateRequest("GET", "/"+school.Id+"/observations?studentId="+observation.StudentId+"&", nil, &school.Users[0].Id)
	assert.Equal(t, result.Code, http.StatusOK)

	type responseBody struct {
		Date      string `csv:"Date"`
		Area      string `csv:"Area"`
		ShortDesc string `csv:"Short Description"`
		Details   string `csv:"Details"`
	}
	body := make([]responseBody, 0)
	err := gocsv.UnmarshalBytes(result.Body.Bytes(), &body)
	assert.NoError(t, err)
	assert.Len(t, body, 0)
}
