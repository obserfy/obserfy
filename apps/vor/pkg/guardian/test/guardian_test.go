package guardian_test

import (
	"net/http"
	"testing"
	"time"

	"github.com/brianvoe/gofakeit/v4"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"

	"github.com/chrsep/vor/pkg/guardian"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/chrsep/vor/pkg/testutils"
)

type GuardianTestSuite struct {
	testutils.BaseTestSuite
}

func (s *GuardianTestSuite) SetupTest() {
	s.Handler = guardian.NewRouter(
		s.Server,
		postgres.GuardianStore{DB: s.DB},
	).ServeHTTP
}

func TestClass(t *testing.T) {
	suite.Run(t, new(GuardianTestSuite))
}

func (s *GuardianTestSuite) TestAuthorization() {
	t := s.T()
	newSchool, _ := s.GenerateSchool()
	newGuardian, userId := s.GenerateGuardian(newSchool)
	tests := []struct {
		name       string
		userId     string
		resultCode int
	}{
		{"valid id", userId, http.StatusOK},
		{"non-existent userid", uuid.New().String(), http.StatusNotFound},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			result := s.CreateRequest("GET", "/"+newGuardian.Id, nil, &test.userId)
			assert.Equal(t, test.resultCode, result.Code)
			if test.resultCode == http.StatusOK {
				var body guardian.Guardian
				err := rest.ParseJson(result.Result().Body, &body)
				assert.NoError(t, err)
				assert.Equal(t, newGuardian.Note, body.Note)
				assert.Equal(t, newGuardian.Phone, body.Phone)
				assert.Equal(t, newGuardian.Email, body.Email)
				assert.Equal(t, newGuardian.Name, body.Name)
			}
		})
	}
}

func (s *GuardianTestSuite) TestGetGuardian() {
	t := s.T()
	newSchool, _ := s.GenerateSchool()
	newGuardian, userId := s.GenerateGuardian(newSchool)
	tests := []struct {
		name       string
		id         string
		resultCode int
	}{
		{"valid id", newGuardian.Id, http.StatusOK},
		{"non-existent id", uuid.New().String(), http.StatusNotFound},
		{"random gibberish id", "asjdf/3i0nce", http.StatusNotFound},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			result := s.CreateRequest("GET", "/"+test.id, nil, &userId)
			assert.Equal(t, test.resultCode, result.Code)
			if test.resultCode == http.StatusOK {
				var body guardian.Guardian
				err := rest.ParseJson(result.Result().Body, &body)
				assert.NoError(t, err)
				assert.Equal(t, newGuardian.Note, body.Note)
				assert.Equal(t, newGuardian.Phone, body.Phone)
				assert.Equal(t, newGuardian.Email, body.Email)
				assert.Equal(t, newGuardian.Name, body.Name)
			}
		})
	}
}

func (s *GuardianTestSuite) TestDeleteGuardian() {
	t := s.T()
	newSchool, _ := s.GenerateSchool()
	newGuardian, userId := s.GenerateGuardian(newSchool)
	tests := []struct {
		name       string
		id         string
		resultCode int
	}{
		{"valid id", newGuardian.Id, http.StatusNoContent},
		{"non-existent id", uuid.New().String(), http.StatusNotFound},
		{"random gibberish id", "asjdf/3i0nce", http.StatusNotFound},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			result := s.CreateRequest("DELETE", "/"+test.id, nil, &userId)
			assert.Equal(t, test.resultCode, result.Code)
			if test.resultCode == http.StatusOK {

			}
		})
	}
}

func (s *GuardianTestSuite) TestUpdateGuardian() {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	type requestBody struct {
		Name    string `json:"name,omitempty"`
		Email   string `json:"email,omitempty"`
		Phone   string `json:"phone,omitempty"`
		Note    string `json:"note,omitempty"`
		Address string `json:"address,omitempty"`
	}
	tests := []struct {
		name       string
		body       requestBody
		resultCode int
	}{
		{"update all", requestBody{
			Name:  gofakeit.Name(),
			Email: gofakeit.Email(),
			Phone: gofakeit.Phone(),
			Note:  gofakeit.Sentence(10),
		}, http.StatusOK},
		{"update name", requestBody{
			Name:  gofakeit.Name(),
			Email: "",
			Phone: "",
			Note:  "",
		}, http.StatusOK},
		{"update note", requestBody{
			Name:  "",
			Email: "",
			Phone: "",
			Note:  gofakeit.Sentence(10),
		}, http.StatusOK},
		{"update email and phone", requestBody{
			Name:  "",
			Email: gofakeit.Email(),
			Phone: gofakeit.Phone(),
			Note:  "",
		}, http.StatusOK},
		{"update note", requestBody{
			Name:  "",
			Email: "",
			Phone: "",
			Note:  gofakeit.Sentence(10),
		}, http.StatusOK},
		{"update none", requestBody{
			Name:  "",
			Email: "",
			Phone: "",
			Note:  "",
		}, http.StatusBadRequest},
		{"update address", requestBody{
			Name:    "",
			Email:   "",
			Phone:   "",
			Note:    "",
			Address: "New Address",
		}, http.StatusOK},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			newSchool, _ := s.GenerateSchool()
			newGuardian, userId := s.GenerateGuardian(newSchool)
			result := s.CreateRequest("PATCH", "/"+newGuardian.Id, test.body, &userId)
			assert.Equal(t, test.resultCode, result.Code)

			savedGuardian := postgres.Guardian{Id: newGuardian.Id}
			err := s.DB.Model(&savedGuardian).WherePK().Select()
			assert.NoError(t, err)

			if test.body.Name != "" {
				assert.Equal(t, test.body.Name, savedGuardian.Name)
			} else {
				assert.Equal(t, newGuardian.Name, savedGuardian.Name)
			}

			if test.body.Email != "" {
				assert.Equal(t, test.body.Email, savedGuardian.Email)
			} else {
				assert.Equal(t, newGuardian.Email, savedGuardian.Email)
			}

			if test.body.Phone != "" {
				assert.Equal(t, test.body.Phone, savedGuardian.Phone)
			} else {
				assert.Equal(t, newGuardian.Phone, savedGuardian.Phone)
			}

			if test.body.Note != "" {
				assert.Equal(t, test.body.Note, savedGuardian.Note)
			} else {
				assert.Equal(t, newGuardian.Note, savedGuardian.Note)
			}

			if test.body.Address != "" {
				assert.Equal(t, test.body.Address, savedGuardian.Address)
			} else {
				assert.Equal(t, newGuardian.Address, savedGuardian.Address)
			}
		})
	}
}
