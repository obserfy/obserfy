package progress_report_test

import (
	"github.com/brianvoe/gofakeit/v4"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/progress_report"
	"github.com/chrsep/vor/pkg/testutils"
	"github.com/stretchr/testify/suite"
	"net/http"
	"testing"
)

type ProgressReportTestSuite struct {
	testutils.BaseTestSuite
}

func (s *ProgressReportTestSuite) SetupTest() {
	s.Handler = progress_report.NewRouter(s.Server, postgres.ProgressReportsStore{DB: s.DB}).ServeHTTP
}

func TestClass(t *testing.T) {
	suite.Run(t, new(ProgressReportTestSuite))
}

func (s *ProgressReportTestSuite) TestAuthorization() {
	school, userId := s.GenerateSchool()
	report := s.GenerateReport(school)

	invalidUserIdResult := s.ApiTest(testutils.ApiMetadata{
		Method: "GET",
		Path:   "/" + report.Id.String(),
		UserId: gofakeit.UUID(),
	})
	s.Equal(invalidUserIdResult.Code, http.StatusNotFound)

	validUserIdResult := s.ApiTest(testutils.ApiMetadata{
		Method: "GET",
		Path:   "/" + report.Id.String(),
		UserId: userId,
	})
	s.Equal(validUserIdResult.Code, http.StatusOK)
}

func (s *ProgressReportTestSuite) TestPublishReport() {
	school, userId := s.GenerateSchool()
	report := s.GenerateReport(school)

	result := s.ApiTest(testutils.ApiMetadata{
		Method: "POST",
		UserId: userId,
		Path:   "/" + report.Id.String() + "/published",
		Body: testutils.H{
			"published": true,
		},
	})

	s.Equal(result.Code, http.StatusOK)

	savedReport := postgres.ProgressReport{Id: report.Id}
	err := s.DB.Model(&savedReport).WherePK().Select()
	s.NoError(err)
	s.Equal(report.Title, savedReport.Title)
	s.Equal(true, savedReport.Published)
	s.Equal(true, savedReport.FreezeAssessments)
}
