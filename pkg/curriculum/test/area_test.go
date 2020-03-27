package curriculum_test

import (
	"github.com/chrsep/vor/pkg/curriculum"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/go-pg/pg/v9"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"net/http"
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
	area := s.saveNewArea()

	result := s.CreateRequest("GET", "/areas/"+area.Id, nil, nil)
	assert.Equal(s.T(), http.StatusOK, result)
}

func (s *AreaTestSuite) TestGetNonExistentArea() {
	result := s.CreateRequest("GET", "/areas/"+uuid.New().String(), nil, nil)
	assert.Equal(s.T(), http.StatusNotFound, result.Code)
}

// Area with complete data should be successful
func (s *AreaTestSuite) TestCreateValidArea() {
	t := s.T()
	// Save curriculum and use its id for request
	c := postgres.Curriculum{Id: uuid.New().String()}
	err := s.DB.Insert(&c)
	assert.NoError(t, err)

	// setup the area for test
	area := curriculum.AreaJson{
		Name:         uuid.New().String(),
		CurriculumId: c.Id,
	}

	// Send request
	result := s.CreateRequest("POST", "/areas", area, nil)

	// Assert that area is saved
	var savedArea postgres.Area
	err = s.DB.Model(&savedArea).
		Where("name=?", area.Name).
		First()
	assert.NoError(t, err)
	assert.EqualValues(t, area.Name, savedArea.Name)
	assert.EqualValues(t, area.CurriculumId, savedArea.CurriculumId)
	assert.EqualValues(t, http.StatusCreated, result.Code)
}

// Area without curriculum should fail
func (s *AreaTestSuite) TestCreateAreaWithNoCurriculum() {
	t := s.T()
	area := s.saveNewArea()

	result := s.CreateRequest("POST", "/areas", area, nil)

	var savedArea postgres.Area
	err := s.DB.Model(&savedArea).
		Where("name=?", area.Name).
		Select()
	assert.EqualError(t, err, pg.ErrNoRows.Error())
	assert.EqualValues(t, http.StatusBadRequest, result.Code)
}

// Area without name should fail
func (s *AreaTestSuite) TestCreateAreaWithNoName() {
	t := s.T()
	// Setup data

	area := s.saveNewArea()

	// Send request
	result := s.CreateRequest("POST", "/areas", area, nil)

	// Assert that area is saved
	var savedArea postgres.Area
	err := s.DB.Model(&savedArea).
		Where("name=?", area.Name).
		Select()
	// Should be unable to find area in db
	assert.EqualError(t, err, pg.ErrNoRows.Error())
	// Should get 403
	assert.EqualValues(t, http.StatusBadRequest, result.Code)
}

func (s *AreaTestSuite) TestDeleteArea() {
	t := s.T()
	area := s.saveNewArea()
	response := s.CreateRequest("DELETE", "/areas/"+area.Id, nil, nil)
	assert.Equal(t, http.StatusOK, response.Code)
	var savedArea postgres.Area
	err := s.DB.Model(&savedArea).
		Where("id=?", area.Id).
		Select()
	assert.Error(t, err)
}

func (s *AreaTestSuite) TestDeleteUnknownArea() {
	t := s.T()
	areaId := uuid.New().String()
	response := s.CreateRequest("DELETE", "/areas/"+areaId, nil, nil)
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

	response := s.CreateRequest("PATCH", "/areas/"+area.Id, newArea, nil)
	assert.Equal(t, http.StatusOK, response.Code)

	var savedArea postgres.Area
	err := s.DB.Model(&savedArea).
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

	response := s.CreateRequest("PATCH", "/areas/"+area.Id, newArea, nil)
	assert.Equal(t, http.StatusBadRequest, response.Code)

	var savedArea postgres.Area
	err := s.DB.Model(&savedArea).
		Where("id=?", area.Id).
		Select()
	assert.NoError(t, err)

	assert.Equal(t, area.Name, savedArea.Name)
	assert.Equal(t, area.CurriculumId, savedArea.CurriculumId)
}
