package school_test

import (
	"github.com/brianvoe/gofakeit/v4"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/testutils"
	"github.com/google/uuid"
	"net/http"
	"strconv"
	"time"
)

type student struct {
	Id            string    `json:"id"`
	Name          string    `json:"name"`
	ProfilePicUrl string    `json:"profilePicUrl,omitempty"`
	Active        bool      `json:"active"`
	DateOfBirth   time.Time `json:"dateOfBirth,omitempty"`
}

func (s *SchoolTestSuite) TestSaveNewStudentWithPic() {
	newSchool, userId := s.GenerateSchool()

	body := student{
		Name:        gofakeit.Name(),
		DateOfBirth: time.Now(),
	}

	result := s.ApiTest(testutils.ApiMetadata{
		Method: "POST",
		Path:   "/" + newSchool.Id + "/students",
		UserId: userId,
		Body:   body,
	})

	s.Equal(result.Code, http.StatusCreated)

	err := s.DB.Model(&postgres.Student{}).
		Where("name = ?", body.Name).
		Select()
	s.NoError(err)
}

func (s *SchoolTestSuite) TestGetStudents() {
	school, userId := s.GenerateSchool()
	students := []*postgres.Student{
		s.GenerateStudent(school),
		s.GenerateStudent(school),
		s.GenerateStudent(school),
		s.GenerateStudent(school),
		s.GenerateStudent(school),
		s.GenerateStudent(school),
	}

	var response []student
	result := s.ApiTest(testutils.ApiMetadata{
		Method:   "GET",
		Path:     "/" + school.Id + "/students",
		UserId:   userId,
		Response: &response,
	})

	s.Equal(result.Code, http.StatusOK)
	s.Len(response, len(students))
}

func (s *SchoolTestSuite) TestGetStudentsByClassId() {
	school, userId := s.GenerateSchool()
	s.GenerateStudent(school)
	s.GenerateStudent(school)

	var response []student

	result := s.ApiTest(testutils.ApiMetadata{
		Method:   "GET",
		Path:     "/" + school.Id + "/students?classId=" + uuid.NewString(),
		UserId:   userId,
		Response: &response,
	})

	s.Equal(result.Code, http.StatusOK)
	s.Len(response, 0)
}

func (s *SchoolTestSuite) TestGetStudentsByStatus() {
	school, userId := s.GenerateSchool()
	s.GenerateStudent(school)
	s.GenerateStudent(school)

	tests := []struct {
		name   string
		active bool
		length int
	}{
		{"active", true, 2},
		{"inactive", false, 0},
	}
	for _, test := range tests {
		s.Run(test.name, func() {
			var response []student

			result := s.ApiTest(testutils.ApiMetadata{
				Method:   "GET",
				Path:     "/" + school.Id + "/students?active=" + strconv.FormatBool(test.active),
				UserId:   userId,
				Response: &response,
			})

			s.Equal(result.Code, http.StatusOK)
			s.Len(response, test.length)
		})
	}
}
