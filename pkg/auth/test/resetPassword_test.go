package forgotpassword_test

import (
	"github.com/chrsep/vor/pkg/auth"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/suite"
	"net/http"
	"testing"
)

type AuthTestSuite struct {
	testutils.BaseTestSuite
	mailService mailServiceMock
}

func (s *AuthTestSuite) SetupTest() {
	store := postgres.AuthStore{s.DB}
	s.mailService = mailServiceMock{}
	s.Handler = auth.NewRouter(s.Server, store, &s.mailService).ServeHTTP
}

func TestAuth(t *testing.T) {
	suite.Run(t, new(AuthTestSuite))
}

func (s *AuthTestSuite) TestResetPassword() {
	t := s.T()
	s.mailService.On("SendResetPassword", mock.Anything).Return(nil)
	tests := []struct {
		name  string
		email string
		code  int
	}{
		{"valid email", "michigan@gmail.com", http.StatusOK},
		{"invalid email format", "michigangmail.com", http.StatusBadRequest},
		{"invalid email format", "michigangmailcom", http.StatusBadRequest},
		{"invalid email format", "asdf@sadfasd", http.StatusBadRequest},
		{"invalid email format", "@asdfa", http.StatusBadRequest},
		{"invalid email format", "@sdf.com", http.StatusBadRequest},
		{"empty email", "", http.StatusBadRequest},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			payload := struct {
				Email string `json:"email"`
			}{test.email}
			w := s.TestRequest("POST", "/reset-password", payload)

			assert.Equal(t, test.code, w.Code, w.Body)
			if test.code == http.StatusBadRequest {
				s.mailService.AssertNotCalled(t, "SendResetPassword", mock.Anything, w.Body)
			} else {
				s.mailService.AssertCalled(t, "SendResetPassword", payload.Email)
			}
		})
	}
}

type mailServiceMock struct {
	mock.Mock
}

func (m *mailServiceMock) SendResetPassword(email string) error {
	args := m.Called(email)
	return args.Error(0)
}
