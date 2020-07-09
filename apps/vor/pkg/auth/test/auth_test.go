package auth_test

import (
	"github.com/benbjohnson/clock"
	"github.com/chrsep/vor/pkg/auth"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/testutils"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/suite"
	"testing"
)

type AuthTestSuite struct {
	testutils.BaseTestSuite

	mailService mailServiceMock
	store       postgres.AuthStore
	Clock       *clock.Mock
}

func (s *AuthTestSuite) SetupTest() {
	s.store = postgres.AuthStore{s.DB}
	s.mailService = mailServiceMock{}
	s.Clock = clock.NewMock()
	s.Handler = auth.NewRouter(s.Server, s.store, &s.mailService, s.Clock).ServeHTTP
}

func TestAuth(t *testing.T) {
	suite.Run(t, new(AuthTestSuite))
}

type mailServiceMock struct {
	mock.Mock
}

func (m *mailServiceMock) SendPasswordResetSuccessful(email string) error {
	args := m.Called(email)
	return args.Error(0)
}

func (m *mailServiceMock) SendResetPassword(email string, token string) error {
	args := m.Called(email)
	return args.Error(0)
}
