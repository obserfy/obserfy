package auth_test

import (
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"net/http"
	"testing"
	"time"
)

func (s *AuthTestSuite) TestInvalidMailPasswordReset() {
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
			w := s.CreateRequest("POST", "/mailPasswordReset", payload, nil)

			assert.Equal(t, http.StatusBadRequest, w.Code, w.Body)
			s.mailService.AssertNotCalled(t, "SendResetPassword", mock.Anything, w.Body)
		})
	}
}

func (s *AuthTestSuite) TestValidMailPasswordReset() {
	s.mailService.On("SendResetPassword", mock.Anything).Return(nil)
	t := s.T()

	user, err := s.GenerateUser()
	assert.NoError(t, err)

	payload := struct {
		Email string `json:"email"`
	}{user.Email}
	w := s.CreateRequest("POST", "/mailPasswordReset", payload, nil)

	assert.Equal(t, http.StatusOK, w.Code, w.Body)
	s.mailService.AssertCalled(t, "SendResetPassword", payload.Email)
	var token postgres.PasswordResetToken
	err = s.DB.Model(&token).
		Where("user_id=?", user.Id).
		Select()
	assert.NoError(t, err)
}

func (s *AuthTestSuite) TestMailPasswordResetNonExistentEmail() {
	s.mailService.On("SendResetPassword", mock.Anything).Return(nil)
	t := s.T()

	user, err := s.GenerateUser()
	assert.NoError(t, err)

	payload := struct {
		Email string `json:"email"`
	}{"asfadskjfhklash@gmail.com"}
	w := s.CreateRequest("POST", "/mailPasswordReset", payload, nil)

	assert.Equal(t, http.StatusOK, w.Code, w.Body)
	s.mailService.AssertNotCalled(t, "SendResetPassword", payload.Email)
	var token postgres.PasswordResetToken
	err = s.DB.Model(&token).
		Where("user_id=?", user.Id).
		Select()
	assert.Error(t, err)
}

// Valid token and password
func (s *AuthTestSuite) TestValidDoPasswordReset() {
	s.mailService.On("SendPasswordResetSuccessful", mock.Anything).
		Return(nil)
	t := s.T()
	token, err := s.GeneratePasswordResetToken()
	assert.NoError(t, err)

	password := uuid.New().String()

	passwordResetPayload := struct {
		Password string `json:"password"`
		Token    string `json:"token"`
	}{password, token.Token}

	resetResult := s.CreateRequest("POST", "/doPasswordReset", passwordResetPayload, nil)
	assert.Equal(t, http.StatusOK, resetResult.Code)

	// make sure the new password can be used for login too
	loginPayload := struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}{token.User.Email, password}
	loginResult := s.CreateRequest("POST", "/login", loginPayload, nil)
	assert.Equal(t, http.StatusOK, loginResult.Code)
	s.mailService.AssertCalled(t, "SendPasswordResetSuccessful", token.User.Email)

	return
}

// Empty password
func (s *AuthTestSuite) TestEmptyPasswordDoPasswordReset() {
	t := s.T()
	token, err := s.GeneratePasswordResetToken()
	assert.NoError(t, err)

	password := ""

	passwordResetPayload := struct {
		Password string `json:"password"`
		Token    string `json:"token"`
	}{password, token.Token}

	resetResult := s.CreateRequest("POST", "/doPasswordReset", passwordResetPayload, nil)
	assert.Equal(t, http.StatusBadRequest, resetResult.Code)
	return
}

// Invalid token
func (s *AuthTestSuite) TestInvalidTokenDoPasswordReset() {
	t := s.T()

	_, err := s.GeneratePasswordResetToken()
	password := uuid.New().String()

	assert.NoError(t, err)

	tests := []struct {
		name  string
		token string
		code  int
	}{
		{"empty token", "", http.StatusBadRequest},
		{"random gibberish", "sadfasdfasdfasdf", http.StatusBadRequest},
		{"random uuid", uuid.New().String(), http.StatusUnauthorized},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			passwordResetPayload := struct {
				Password string `json:"password"`
				Token    string `json:"token"`
			}{password, test.token}

			resetResult := s.CreateRequest("POST", "/doPasswordReset", passwordResetPayload, nil)
			assert.Equal(t, test.code, resetResult.Code)
		})
	}
}

// Test reuse token should fail
func (s *AuthTestSuite) TestDoPasswordResetTwiceShouldFailed() {
	s.mailService.On("SendPasswordResetSuccessful", mock.Anything).
		Return(nil)
	t := s.T()
	token, err := s.GeneratePasswordResetToken()
	assert.NoError(t, err)

	password := uuid.New().String()

	type PasswordReset struct {
		Password string `json:"password"`
		Token    string `json:"token"`
	}
	passwordResetPayload := PasswordReset{password, token.Token}
	resetResult := s.CreateRequest("POST", "/doPasswordReset", passwordResetPayload, nil)
	assert.Equal(t, http.StatusOK, resetResult.Code)
	// make sure the new password can be used for login too
	password2 := uuid.New().String()
	passwordResetPayload2 := PasswordReset{password2, token.Token}
	secondPasswordResetResult := s.CreateRequest("POST", "/doPasswordReset", passwordResetPayload2, nil)
	assert.Equal(t, http.StatusUnauthorized, secondPasswordResetResult.Code)

	// make sure the password can be used for login
	type LoginPayload struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	loginPayload := LoginPayload{token.User.Email, password}
	loginResult := s.CreateRequest("POST", "/login", loginPayload, nil)
	assert.Equal(t, http.StatusOK, loginResult.Code)
	// make sure the password can be used for login
	loginPayload2 := LoginPayload{token.User.Email, password2}
	loginResult2 := s.CreateRequest("POST", "/login", loginPayload2, nil)
	assert.Equal(t, http.StatusUnauthorized, loginResult2.Code)
	return
}

// Test expired token should not be usable
func (s *AuthTestSuite) TestExpiredTokenDoPasswordReset() {
	t := s.T()
	token, err := s.GeneratePasswordResetToken()
	assert.NoError(t, err)

	// Advance time by 1 hour
	s.Clock.Set(time.Now())
	s.Clock.Add(time.Hour)

	password := uuid.New().String()
	type PasswordReset struct {
		Password string `json:"password"`
		Token    string `json:"token"`
	}
	passwordResetPayload := PasswordReset{password, token.Token}
	resetResult := s.CreateRequest("POST", "/doPasswordReset", passwordResetPayload, nil)
	assert.Equal(t, http.StatusUnauthorized, resetResult.Code)

	// Login should fail
	type LoginPayload struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	loginPayload := LoginPayload{token.User.Email, password}
	loginResult := s.CreateRequest("POST", "/login", loginPayload, nil)
	assert.Equal(t, http.StatusUnauthorized, loginResult.Code)
}
