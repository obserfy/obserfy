package school_test

import (
	"github.com/brianvoe/gofakeit/v4"
	"github.com/chrsep/vor/pkg/testutils"
	"net/http"

	"github.com/chrsep/vor/pkg/postgres"
)

type guardian struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Phone   string `json:"phone"`
	Note    string `json:"note"`
	Address string `json:"address"`
}

func (s *SchoolTestSuite) TestCreateNewGuardian() {
	school, userId := s.GenerateSchool()
	tests := []struct {
		name       string
		school     postgres.School
		body       guardian
		resultCode int
	}{
		{"complete", *school, guardian{
			Name:    gofakeit.Name(),
			Email:   gofakeit.Email(),
			Phone:   gofakeit.Phone(),
			Note:    gofakeit.Sentence(10),
			Address: gofakeit.Address().Address,
		}, http.StatusCreated},
		{"only name", *school, guardian{
			Name: gofakeit.Name(),
		}, http.StatusCreated},
		{"without name", *school, guardian{
			Email: gofakeit.Email(),
			Phone: gofakeit.Phone(),
			Note:  gofakeit.Sentence(10),
		}, http.StatusBadRequest},
	}
	for _, test := range tests {
		s.Run(test.name, func() {
			result := s.ApiTest(testutils.ApiMetadata{
				Method: "POST",
				Path:   "/" + test.school.Id + "/guardians",
				UserId: userId,
				Body:   test.body,
			})
			s.Equal(test.resultCode, result.Code)

			var savedGuardian postgres.Guardian
			err := s.DB.Model(&savedGuardian).
				Where("name=?", test.body.Name).
				Select()
			if test.resultCode == http.StatusCreated {
				s.NoError(err)
				s.Equal(test.body.Name, savedGuardian.Name)
				s.Equal(test.body.Phone, savedGuardian.Phone)
				s.Equal(test.body.Email, savedGuardian.Email)
				s.Equal(test.body.Note, savedGuardian.Note)
				s.Equal(test.body.Address, savedGuardian.Address)
				s.Equal(test.school.Id, savedGuardian.SchoolId)
			} else {
				s.Error(err)
			}
		})
	}
}

func (s *SchoolTestSuite) TestGetSchoolGuardians() {
	newSchool, userId := s.GenerateSchool()
	newGuardian, _ := s.GenerateGuardian(newSchool)

	var response []guardian
	result := s.ApiTest(testutils.ApiMetadata{
		Method:   "GET",
		Path:     "/" + newSchool.Id + "/guardians",
		UserId:   userId,
		Response: &response,
	})

	s.Equal(http.StatusOK, result.Code)
	s.Len(response, 1)
	s.Equal(newGuardian.Name, response[0].Name)
	s.Equal(newGuardian.Note, response[0].Note)
	s.Equal(newGuardian.Phone, response[0].Phone)
	s.Equal(newGuardian.Email, response[0].Email)
}

func (s *SchoolTestSuite) TestGetSchoolGuardians_WithNoGuardian() {
	newSchool, userId := s.GenerateSchool()

	var response []guardian
	result := s.ApiTest(testutils.ApiMetadata{
		Method:   "GET",
		Path:     "/" + newSchool.Id + "/guardians",
		UserId:   userId,
		Response: &response,
	})

	s.Equal(http.StatusOK, result.Code)
	s.Len(response, 0)
}
