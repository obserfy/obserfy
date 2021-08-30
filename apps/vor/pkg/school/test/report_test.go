package school_test

import (
	"github.com/brianvoe/gofakeit/v4"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/testutils"
	"github.com/google/uuid"
	"net/http"
	"time"
)

type progressReport struct {
	Id                uuid.UUID `pg:"type:uuid"`
	Title             string    `json:"title"`
	PeriodStart       time.Time `json:"periodStart"`
	PeriodEnd         time.Time `json:"periodEnd"`
	CustomizeStudents bool      `json:"customizeStudents"`
	Students          []string  `json:"students"`
}

func (s *SchoolTestSuite) TestGetReport() {
	school, userId := s.GenerateSchool()
	newReports := []postgres.ProgressReport{
		s.GenerateReport(school),
		s.GenerateReport(school),
		s.GenerateReport(school),
		s.GenerateReport(school),
	}

	var response []progressReport
	result := s.ApiTest(testutils.ApiMetadata{
		Method:   "GET",
		Path:     "/" + school.Id + "/progress-reports",
		UserId:   userId,
		Response: &response,
	})

	s.Equal(result.Code, http.StatusOK)
	s.Len(response, len(newReports))
}

func (s *SchoolTestSuite) TestCreateDefaultReport() {
	gofakeit.Seed(time.Now().UnixNano())
	school, userId := s.GenerateSchool()
	s.GenerateStudent(school)
	s.GenerateStudent(school)
	s.GenerateStudent(school)
	s.GenerateStudent(school)

	var request = progressReport{
		Title:             gofakeit.UUID(),
		PeriodStart:       gofakeit.Date(),
		PeriodEnd:         gofakeit.Date(),
		CustomizeStudents: false,
		Students:          nil,
	}
	result := s.ApiTest(testutils.ApiMetadata{
		Method: "POST",
		Path:   "/" + school.Id + "/progress-reports",
		UserId: userId,
		Body:   request,
	})
	reportInDB := postgres.ProgressReport{}
	err := s.DB.Model(&reportInDB).
		Where("title = ?", request.Title).
		Relation("StudentReports").
		Select()

	s.NoError(err)
	s.Equal(result.Code, http.StatusCreated)
	s.Len(reportInDB.StudentReports, 4)
	s.Equal(reportInDB.Title, request.Title)
}

func (s *SchoolTestSuite) TestCreateReportWithCustomStudents() {
	gofakeit.Seed(time.Now().UnixNano())
	school, userId := s.GenerateSchool()
	s.GenerateStudent(school)
	s.GenerateStudent(school)

	includedStudents := []string{
		s.GenerateStudent(school).Id,
		s.GenerateStudent(school).Id,
		s.GenerateStudent(school).Id,
	}

	var request = progressReport{
		Title:             gofakeit.UUID(),
		PeriodStart:       gofakeit.Date(),
		PeriodEnd:         gofakeit.Date(),
		CustomizeStudents: true,
		Students:          includedStudents,
	}
	result := s.ApiTest(testutils.ApiMetadata{
		Method: "POST",
		Path:   "/" + school.Id + "/progress-reports",
		UserId: userId,
		Body:   request,
	})

	reportInDB := postgres.ProgressReport{}
	err := s.DB.Model(&reportInDB).
		Where("title = ?", request.Title).
		Relation("StudentReports").
		Select()

	s.NoError(err)
	s.Equal(result.Code, http.StatusCreated)
	s.Len(reportInDB.StudentReports, len(includedStudents))
}

func (s *SchoolTestSuite) TestStudentsListIgnoredWhenCustomizeStudentsFalse() {
	gofakeit.Seed(time.Now().UnixNano())
	school, userId := s.GenerateSchool()
	s.GenerateStudent(school)
	s.GenerateStudent(school)

	includedStudents := []string{
		s.GenerateStudent(school).Id,
		s.GenerateStudent(school).Id,
		s.GenerateStudent(school).Id,
	}

	var request = progressReport{
		Title:             gofakeit.UUID(),
		PeriodStart:       gofakeit.Date(),
		PeriodEnd:         gofakeit.Date(),
		CustomizeStudents: false,
		Students:          includedStudents,
	}
	result := s.ApiTest(testutils.ApiMetadata{
		Method: "POST",
		Path:   "/" + school.Id + "/progress-reports",
		UserId: userId,
		Body:   request,
	})

	reportInDB := postgres.ProgressReport{}
	err := s.DB.Model(&reportInDB).
		Where("title = ?", request.Title).
		Relation("StudentReports").
		Select()

	s.NoError(err)
	s.Equal(result.Code, http.StatusCreated)
	s.Len(reportInDB.StudentReports, 5)
}
