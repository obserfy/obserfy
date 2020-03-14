package school_test

import (
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/school"
	"github.com/chrsep/vor/pkg/testutils"
	"github.com/stretchr/testify/suite"
	"testing"
)

type SchoolTestSuite struct {
	testutils.BaseTestSuite

	store postgres.SchoolStore
}

func (s *SchoolTestSuite) SetupTest() {
	s.store = postgres.SchoolStore{s.DB}
	s.Handler = school.NewRouter(s.Server, s.store).ServeHTTP
}

func TestObservation(t *testing.T) {
	suite.Run(t, new(SchoolTestSuite))
}
