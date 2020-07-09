package school_test

import (
	"github.com/brianvoe/gofakeit/v4"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/stretchr/testify/assert"
	"net/http"
	"testing"
	"time"
)

func (s *SchoolTestSuite) TestCreateNewGuardian() {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	type requestBody struct {
		Name  string `json:"name"`
		Email string `json:"email"`
		Phone string `json:"phone"`
		Note  string `json:"note"`
	}
	tests := []struct {
		name       string
		school     postgres.School
		body       requestBody
		resultCode int
	}{
		{"complete", *s.GenerateSchool(), requestBody{
			Name:  gofakeit.Name(),
			Email: gofakeit.Email(),
			Phone: gofakeit.Phone(),
			Note:  gofakeit.Sentence(10),
		}, http.StatusCreated},
		{"only name", *s.GenerateSchool(), requestBody{
			Name: gofakeit.Name(),
		}, http.StatusCreated},
		{"without name", *s.GenerateSchool(), requestBody{
			Email: gofakeit.Email(),
			Phone: gofakeit.Phone(),
			Note:  gofakeit.Sentence(10),
		}, http.StatusBadRequest},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			result := s.CreateRequest("POST", "/"+test.school.Id+"/guardians", test.body, &test.school.Users[0].Id)
			assert.Equal(t, test.resultCode, result.Code)

			var savedGuardian postgres.Guardian
			err := s.DB.Model(&savedGuardian).
				Where("name=?", test.body.Name).
				Select()
			if test.resultCode == http.StatusCreated {
				assert.NoError(t, err)
				assert.Equal(t, test.body.Name, savedGuardian.Name)
				assert.Equal(t, test.body.Phone, savedGuardian.Phone)
				assert.Equal(t, test.body.Email, savedGuardian.Email)
				assert.Equal(t, test.body.Note, savedGuardian.Note)
				assert.Equal(t, test.school.Id, savedGuardian.SchoolId)
			} else {
				assert.Error(t, err)
			}
		})
	}
}

func (s *SchoolTestSuite) TestGetSchoolGuardians() {
	t := s.T()
	newSchool := s.GenerateSchool()
	guardian, userId := s.GenerateGuardian(newSchool)

	result := s.CreateRequest("GET", "/"+guardian.SchoolId+"/guardians", nil, &userId)
	assert.Equal(t, http.StatusOK, result.Code)

	type responseBody struct {
		Name  string `json:"name"`
		Email string `json:"email"`
		Phone string `json:"phone"`
		Note  string `json:"note"`
	}
	var body []responseBody
	err := rest.ParseJson(result.Result().Body, &body)
	assert.NoError(t, err)

	assert.Len(t, body, 1)
	assert.Equal(t, guardian.Name, body[0].Name)
	assert.Equal(t, guardian.Note, body[0].Note)
	assert.Equal(t, guardian.Phone, body[0].Phone)
	assert.Equal(t, guardian.Email, body[0].Email)
}

func (s *SchoolTestSuite) TestGetSchoolGuardians_WithNoGuardian() {
	t := s.T()
	newSchool := s.GenerateSchool()

	result := s.CreateRequest("GET", "/"+newSchool.Id+"/guardians", nil, &newSchool.Users[0].Id)
	assert.Equal(t, http.StatusOK, result.Code)

	type responseBody struct {
		Name  string `json:"name"`
		Email string `json:"email"`
		Phone string `json:"phone"`
		Note  string `json:"note"`
	}
	var body []responseBody
	err := rest.ParseJson(result.Result().Body, &body)
	assert.NoError(t, err)

	assert.Len(t, body, 0)
}
