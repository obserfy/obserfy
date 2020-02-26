package auth_test

import (
	"github.com/brianvoe/gofakeit/v4"
	"github.com/chrsep/vor/pkg/auth"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/testutils"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/suite"
	"testing"
	"time"
)

type AuthTestSuite struct {
	testutils.BaseTestSuite
	mailService mailServiceMock
	store       postgres.AuthStore
}

func (s *AuthTestSuite) SetupTest() {
	s.store = postgres.AuthStore{s.DB}
	s.mailService = mailServiceMock{}
	s.Handler = auth.NewRouter(s.Server, s.store, &s.mailService).ServeHTTP
}

func TestAuth(t *testing.T) {
	suite.Run(t, new(AuthTestSuite))
}

type mailServiceMock struct {
	mock.Mock
}

func (m *mailServiceMock) SendResetPassword(email string) error {
	args := m.Called(email)
	return args.Error(0)
}

func (s *AuthTestSuite) SaveNewUser() (*postgres.User, error) {
	gofakeit.Seed(time.Now().UnixNano())
	user, err := s.store.NewUser(
		gofakeit.Email(),
		gofakeit.Password(true, true, true, true, true, 10),
		gofakeit.Name(),
		"",
	)
	if err != nil {
		return nil, err
	}
	return user, nil
}
