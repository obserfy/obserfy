package curriculum_test

import (
	"bytes"
	"encoding/json"
	"github.com/chrsep/vor/pkg/curriculum"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-pg/pg/v9"
	"github.com/google/uuid"
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

/////////////////////////////////
// Helper functions
/////////////////////////////////
func (s *baseCurriculumTestSuite) saveNewMaterial() postgres.Material {
	subject := s.saveNewSubject()

	// save subject
	material := postgres.Material{
		Id:        uuid.New().String(),
		Name:      uuid.New().String(),
		SubjectId: subject.Id,
		Subject:   subject,
	}
	err := s.db.Insert(&material)
	assert.NoError(s.T(), err)
	return material
}

func (s *baseCurriculumTestSuite) saveNewSubject() postgres.Subject {
	// Save area
	area := s.saveNewArea()

	// save subject
	originalSubject := postgres.Subject{
		Id:     uuid.New().String(),
		Name:   uuid.New().String(),
		AreaId: area.Id,
		Area:   area,
	}
	err := s.db.Insert(&originalSubject)
	assert.NoError(s.T(), err)
	return originalSubject
}

func (s *baseCurriculumTestSuite) saveNewArea() postgres.Area {
	area := postgres.Area{
		Id:           uuid.New().String(),
		CurriculumId: "",
		Curriculum:   postgres.Curriculum{},
		Name:         "",
		Subjects:     nil,
	}
	err := s.db.Insert(&area)
	assert.NoError(s.T(), err)
	return area
}

func (s *baseCurriculumTestSuite) testRequest(method string, path string, bodyJson interface{}) {
	s.w = httptest.NewRecorder()
	body, err := json.Marshal(bodyJson)
	assert.NoError(s.T(), err)

	req := httptest.NewRequest(method, path, bytes.NewBuffer(body))
	s.handler(s.w, req)
}
