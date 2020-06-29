package curriculum_test

import (
	"github.com/chrsep/vor/pkg/curriculum"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/testutils"
)

// Test suite
type baseCurriculumTestSuite struct {
	testutils.BaseTestSuite
	store curriculum.Store
}

func (s *baseCurriculumTestSuite) SetupTest() {
	s.store = postgres.CurriculumStore{s.DB}
	s.Handler = curriculum.NewRouter(s.Server, s.store).ServeHTTP
}
