package curriculum_test

import (
	"bytes"
	"encoding/json"
	"github.com/chrsep/vor/pkg/curriculum"
	"github.com/chrsep/vor/pkg/logger"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-pg/pg/v9"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"net/http"
	"net/http/httptest"
	"testing"
)

type AreaTestSuite struct {
	suite.Suite
	db      *pg.DB
	store   curriculum.Store
	server  rest.Server
	handler http.HandlerFunc
	w       *httptest.ResponseRecorder
}

func (suite *AreaTestSuite) TearDownSuite() {
	if err := suite.db.Close(); err != nil {
		assert.NoError(suite.T(), err)
	}
}

func (suite *AreaTestSuite) SetupTest() {
	db, err := connectTestDB()
	assert.NoError(suite.T(), err)
	suite.db = db
	suite.store = postgres.CurriculumStore{db}
	suite.server = rest.NewServer(logger.New())
	suite.handler = curriculum.NewRouter(suite.server, suite.store).ServeHTTP
	suite.w = httptest.NewRecorder()
}

func TestAreaTestSuite(t *testing.T) {
	suite.Run(t, new(AreaTestSuite))
}

// Not existent area should return 404
func (suite *AreaTestSuite) TestGetExistingArea() {
	area := postgres.Area{Id: uuid.New().String()}
	err := suite.db.Insert(&area)
	assert.NoError(suite.T(), err)

	assert.HTTPSuccess(suite.T(), suite.handler, "GET", "/areas/"+area.Id, nil)
}

func (suite *AreaTestSuite) TestGetNonExistentArea() {
	assert.HTTPError(suite.T(), suite.handler, "GET", "/areas/"+uuid.New().String(), nil)
}

// Area with complete data should be successful
func (suite *AreaTestSuite) TestCreateValidArea() {
	t := suite.T()
	// Save curriculum and use its id for request
	c := postgres.Curriculum{Id: uuid.New().String()}
	if err := suite.db.Insert(&c); err != nil {
		assert.NoError(t, err)
	}

	// setup the area for test
	area := curriculum.AreaJson{
		Name:         uuid.New().String(),
		CurriculumId: c.Id,
	}
	body, err := json.Marshal(area)
	assert.NoError(t, err)

	// Send request
	req := httptest.NewRequest("POST", "/areas", bytes.NewBuffer(body))
	suite.handler.ServeHTTP(suite.w, req)

	// Assert that area is saved
	var savedArea postgres.Area
	err = suite.db.Model(&savedArea).
		Where("name=?", area.Name).
		First()
	assert.NoError(t, err)
	assert.EqualValues(t, area.Name, savedArea.Name)
	assert.EqualValues(t, area.CurriculumId, savedArea.CurriculumId)
	assert.EqualValues(t, http.StatusCreated, suite.w.Code)
}

// Area without curriculum should fail
func (suite *AreaTestSuite) TestCreateAreaWithNoCurriculum() {
	t := suite.T()
	area := curriculum.AreaJson{Name: uuid.New().String()}
	body, err := json.Marshal(area)
	assert.NoError(t, err)

	req := httptest.NewRequest("POST", "/areas", bytes.NewBuffer(body))
	suite.handler.ServeHTTP(suite.w, req)

	var savedArea postgres.Area
	err = suite.db.Model(&savedArea).
		Where("name=?", area.Name).
		Select()
	assert.EqualError(t, err, pg.ErrNoRows.Error())
	assert.EqualValues(t, http.StatusBadRequest, suite.w.Code)
}

// Area without name should fail
func (suite *AreaTestSuite) TestCreateAreaWithNoName() {
	t := suite.T()
	// Setup data
	c := postgres.Curriculum{Id: uuid.New().String()}
	if err := suite.db.Insert(&c); err != nil {
		assert.NoError(t, err)
	}

	area := curriculum.AreaJson{CurriculumId: c.Id}
	body, err := json.Marshal(area)

	// Send request
	req := httptest.NewRequest("POST", "/areas", bytes.NewBuffer(body))
	suite.handler.ServeHTTP(suite.w, req)

	// Assert that area is saved
	var savedArea postgres.Area
	err = suite.db.Model(&savedArea).
		Where("name=?", area.Name).
		Select()
	// Should be unable to find area in db
	assert.EqualError(t, err, pg.ErrNoRows.Error())
	// Should get 403
	assert.EqualValues(t, http.StatusBadRequest, suite.w.Code)
}


