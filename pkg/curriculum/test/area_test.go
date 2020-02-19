package curriculum_test

import (
	"bytes"
	"encoding/json"
	"github.com/chrsep/vor/pkg/curriculum"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/go-pg/pg/v9"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"net/http"
	"net/http/httptest"
	"testing"
)

type AreaTestSuite struct {
	baseCurriculumTestSuite
}

func TestAreaTestSuite(t *testing.T) {
	suite.Run(t, new(AreaTestSuite))
}

// Not existent area should return 404
func (s *AreaTestSuite) TestGetExistingArea() {
	area := postgres.Area{Id: uuid.New().String()}
	err := s.db.Insert(&area)
	assert.NoError(s.T(), err)

	assert.HTTPSuccess(s.T(), s.handler, "GET", "/areas/"+area.Id, nil)
}

func (s *AreaTestSuite) TestGetNonExistentArea() {
	assert.HTTPError(s.T(), s.handler, "GET", "/areas/"+uuid.New().String(), nil)
}

// Area with complete data should be successful
func (s *AreaTestSuite) TestCreateValidArea() {
	t := s.T()
	// Save curriculum and use its id for request
	c := postgres.Curriculum{Id: uuid.New().String()}
	if err := s.db.Insert(&c); err != nil {
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
	s.handler.ServeHTTP(s.w, req)

	// Assert that area is saved
	var savedArea postgres.Area
	err = s.db.Model(&savedArea).
		Where("name=?", area.Name).
		First()
	assert.NoError(t, err)
	assert.EqualValues(t, area.Name, savedArea.Name)
	assert.EqualValues(t, area.CurriculumId, savedArea.CurriculumId)
	assert.EqualValues(t, http.StatusCreated, s.w.Code)
}

// Area without curriculum should fail
func (s *AreaTestSuite) TestCreateAreaWithNoCurriculum() {
	t := s.T()
	area := curriculum.AreaJson{Name: uuid.New().String()}
	body, err := json.Marshal(area)
	assert.NoError(t, err)

	req := httptest.NewRequest("POST", "/areas", bytes.NewBuffer(body))
	s.handler.ServeHTTP(s.w, req)

	var savedArea postgres.Area
	err = s.db.Model(&savedArea).
		Where("name=?", area.Name).
		Select()
	assert.EqualError(t, err, pg.ErrNoRows.Error())
	assert.EqualValues(t, http.StatusBadRequest, s.w.Code)
}

// Area without name should fail
func (s *AreaTestSuite) TestCreateAreaWithNoName() {
	t := s.T()
	// Setup data
	c := postgres.Curriculum{Id: uuid.New().String()}
	if err := s.db.Insert(&c); err != nil {
		assert.NoError(t, err)
	}

	area := curriculum.AreaJson{CurriculumId: c.Id}
	body, err := json.Marshal(area)

	// Send request
	req := httptest.NewRequest("POST", "/areas", bytes.NewBuffer(body))
	s.handler.ServeHTTP(s.w, req)

	// Assert that area is saved
	var savedArea postgres.Area
	err = s.db.Model(&savedArea).
		Where("name=?", area.Name).
		Select()
	// Should be unable to find area in db
	assert.EqualError(t, err, pg.ErrNoRows.Error())
	// Should get 403
	assert.EqualValues(t, http.StatusBadRequest, s.w.Code)
}

func (s *AreaTestSuite) TestDeleteArea() {
	t := s.T()
	area := s.saveNewArea()
	response := s.testRequest("DELETE", "/areas/"+area.Id, nil)
	assert.Equal(t, http.StatusOK, response.Code)
	var savedArea postgres.Area
	err := s.db.Model(&savedArea).
		Where("id=?", area.Id).
		Select()
	assert.Error(t, err)
}

func (s *AreaTestSuite) TestDeleteUnknownArea() {
	t := s.T()
	areaId := uuid.New().String()
	response := s.testRequest("DELETE", "/areas/"+areaId, nil)
	assert.Equal(t, http.StatusNotFound, response.Code)
}

func (s *AreaTestSuite) TestUpdateAreaName() {
	t := s.T()
	area := s.saveNewArea()

	type payload struct {
		Name string `json:"name"`
	}
	newArea := payload{
		Name: uuid.New().String(),
	}

	response := s.testRequest("PATCH", "/areas/"+area.Id, newArea)
	assert.Equal(t, http.StatusOK, response.Code)

	var savedArea postgres.Area
	err := s.db.Model(&savedArea).
		Where("id=?", area.Id).
		Select()
	assert.NoError(t, err)

	assert.Equal(t, newArea.Name, savedArea.Name)
	assert.Equal(t, area.CurriculumId, savedArea.CurriculumId)
}

func (s *AreaTestSuite) TestUpdateInvalidAreaName() {
	t := s.T()
	area := s.saveNewArea()

	type payload struct {
		Name string `json:"name"`
	}
	newArea := payload{
		Name: "",
	}

	response := s.testRequest("PATCH", "/areas/"+area.Id, newArea)
	assert.Equal(t, http.StatusBadRequest, response.Code)

	var savedArea postgres.Area
	err := s.db.Model(&savedArea).
		Where("id=?", area.Id).
		Select()
	assert.NoError(t, err)

	assert.Equal(t, area.Name, savedArea.Name)
	assert.Equal(t, area.CurriculumId, savedArea.CurriculumId)
}
