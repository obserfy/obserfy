package school_test

import (
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/testutils"
	"github.com/google/uuid"
	"net/http"
	"time"
)

type report struct {
	Id          uuid.UUID `pg:"type:uuid"`
	Title       string    `json:"title"`
	PeriodStart time.Time `json:"periodStart"`
	PeriodEnd   time.Time `json:"periodEnd"`
}

func (s *SchoolTestSuite) TestGetReport() {
	school, userId := s.GenerateSchool()
	newReports := []postgres.ProgressReport{
		s.GenerateReport(school),
		s.GenerateReport(school),
		s.GenerateReport(school),
		s.GenerateReport(school),
	}

	var response []report
	result := s.ApiTest(testutils.ApiMetadata{
		Method:   "GET",
		Path:     "/" + school.Id + "/progress-reports",
		UserId:   userId,
		Response: &response,
	})

	s.Equal(result.Code, http.StatusOK)
	s.Len(response, len(newReports))
}
