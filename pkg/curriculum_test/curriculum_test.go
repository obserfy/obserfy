package curriculum_test

import (
	"github.com/chrsep/vor/pkg/curriculum"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-pg/pg/v9"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap/zaptest"
	"net/http"
	"net/http/httptest"
)

func connectTestDB() (*pg.DB, error) {
	db := postgres.Connect(
		"postgres",
		"postgres",
		"localhost:5432",
		nil,
	)
	err := postgres.InitTables(db)
	if err != nil {
		return nil, err
	}
	return db, nil
}

// Test suite
type baseCurriculumTestSuite struct {
	suite.Suite
	db      *pg.DB
	store   curriculum.Store
	server  rest.Server
	handler http.HandlerFunc
	w       *httptest.ResponseRecorder
}

func (s *baseCurriculumTestSuite) TearDownSuite() {
	if err := s.db.Close(); err != nil {
		assert.NoError(s.T(), err)
	}
}

func (s *baseCurriculumTestSuite) SetupTest() {
	db, err := connectTestDB()
	assert.NoError(s.T(), err)
	s.db = db
	s.store = postgres.CurriculumStore{db}
	s.server = rest.NewServer(zaptest.NewLogger(s.T()))
	s.handler = curriculum.NewRouter(s.server, s.store).ServeHTTP
	s.w = httptest.NewRecorder()
}
