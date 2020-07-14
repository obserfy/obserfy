package school_test

import (
	"github.com/brianvoe/gofakeit/v4"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"net/http"
	"time"

	"github.com/stretchr/testify/assert"
)

func (s *SchoolTestSuite) TestSaveNewStudentWithPic() {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	newSchool := s.GenerateSchool()

	payload := struct {
		Name        string    `json:"name"`
		DateOfBirth time.Time `json:"dateOfBirth"`
	}{Name: gofakeit.Name(), DateOfBirth: time.Now()}

	result := s.CreateRequest("POST", "/"+newSchool.Id+"/students", payload, &newSchool.Users[0].Id)
	assert.Equal(t, result.Code, http.StatusCreated)

	var student postgres.Student
	err := s.DB.Model(&student).Where("name = ?", payload.Name).Select()
	assert.NoError(t, err)
}

func (s *SchoolTestSuite) TestGetStudents() {
	t := s.T()
	school := s.GenerateSchool()
	students := []postgres.Student{
		*s.GenerateStudent(school),
		*s.GenerateStudent(school),
		*s.GenerateStudent(school),
		*s.GenerateStudent(school),
		*s.GenerateStudent(school),
		*s.GenerateStudent(school),
	}

	var responseBody []struct {
		Id            string     `json:"id"`
		Name          string     `json:"name"`
		DateOfBirth   *time.Time `json:"dateOfBirth,omitempty"`
		ProfilePicUrl string     `json:"profilePicUrl,omitempty"`
		Active        bool       `json:"active"`
	}
	result := s.CreateRequest("GET", "/"+school.Id+"/students", nil, &school.Users[0].Id)
	assert.Equal(t, result.Code, http.StatusOK)

	err := rest.ParseJson(result.Result().Body, &responseBody)
	assert.NoError(t, err)

	assert.Equal(t, len(students), len(responseBody))
}
