package auth_test

import (
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"net/http"
	"testing"
)

func (s *AuthTestSuite) TestInvalidResetPassword() {
	t := s.T()
	s.mailService.On("SendResetPassword", mock.Anything).Return(nil)

	tests := []struct {
		name  string
		email string
	}{
		{"invalid email format", "michigangmail.com"},
		{"invalid email format", "michigangmailcom"},
		{"invalid email format", "asdf@sadfasd"},
		{"invalid email format", "@asdfa"},
		{"invalid email format", "@sdf.com"},
		{"empty email", ""},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			payload := struct {
				Email string `json:"email"`
			}{test.email}
			w := s.CreateRequest("POST", "/reset-password", payload)

			assert.Equal(t, http.StatusBadRequest, w.Code, w.Body)
			s.mailService.AssertNotCalled(t, "SendResetPassword", mock.Anything, w.Body)
		})
	}
}

func (s *AuthTestSuite) TestValidResetPassword() {
	t := s.T()

	user, err := s.SaveNewUser()
	assert.NoError(t, err)

	tests := []struct {
		name      string
		email     string
		emailSent bool
	}{
		{"valid existing email", user.Email, true},
		{"valid non existent email", "michigafdf@ngmail.com", false},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			s.mailService.On("SendResetPassword", mock.Anything).Return(nil)
			payload := struct {
				Email string `json:"email"`
			}{test.email}
			w := s.CreateRequest("POST", "/reset-password", payload)

			assert.Equal(t, http.StatusOK, w.Code, w.Body)
			if test.emailSent {
				s.mailService.AssertCalled(t, "SendResetPassword", payload.Email)
			} else {
				s.mailService.AssertNotCalled(t, "SendResetPassword", payload.Email)
			}
		})
	}
}
