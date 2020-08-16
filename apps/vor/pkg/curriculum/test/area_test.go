package curriculum_test

import (
	"net/http"
	"testing"

	"github.com/go-pg/pg/v10"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"

	"github.com/chrsep/vor/pkg/postgres"
)

type AreaTestSuite struct {
	baseCurriculumTestSuite
}

func TestAreaTestSuite(t *testing.T) {
	suite.Run(t, new(AreaTestSuite))
}

// Not existent area should return 404
func (s *AreaTestSuite) TestGetExistingArea() {
	area, _ := s.GenerateArea()

	userId := area.Curriculum.Schools[0].Users[0].Id
	result := s.CreateRequest("GET", "/areas/"+area.Id, nil, &userId)
	assert.Equal(s.T(), http.StatusOK, result.Code)
}

func (s *AreaTestSuite) TestGetNonExistentArea() {
	school := s.GenerateSchool()
	result := s.CreateRequest("GET", "/areas/"+uuid.New().String(), nil, &school.Users[0].Id)
	assert.Equal(s.T(), http.StatusNotFound, result.Code)
}

// Area with complete data should be successful
func (s *AreaTestSuite) TestCreateValidArea() {
	t := s.T()
	// Save curriculum and use its id for request
	school := s.GenerateSchool()

	// setup the area for test
	area := struct {
		Name string `json:"name"`
	}{Name: uuid.New().String()}

	// Send request
	result := s.CreateRequest("POST", "/"+school.CurriculumId+"/areas", area, &school.Users[0].Id)
	assert.EqualValues(t, http.StatusCreated, result.Code)

	// Assert that area is saved
	var savedArea postgres.Area
	err := s.DB.Model(&savedArea).
		Where("name=?", area.Name).
		First()
	assert.NoError(t, err)
	assert.EqualValues(t, area.Name, savedArea.Name)
	assert.EqualValues(t, school.CurriculumId, savedArea.CurriculumId)
}

// Area without curriculum should fail
func (s *AreaTestSuite) TestCreateAreaWithNoCurriculum() {
	t := s.T()
	area, userId := s.GenerateArea()

	result := s.CreateRequest("POST", "//areas", area, &userId)

	var savedArea postgres.Area
	err := s.DB.Model(&savedArea).
		Where("name=?", area.Name).
		Select()
	assert.EqualError(t, err, pg.ErrNoRows.Error())
	assert.EqualValues(t, http.StatusNotFound, result.Code)
}

// Area without name should fail
func (s *AreaTestSuite) TestCreateAreaWithNoName() {
	t := s.T()
	// Setup data

	area, userId := s.GenerateArea()

	// Send request
	result := s.CreateRequest("POST", "/"+area.CurriculumId+"/areas", area, &userId)
	assert.EqualValues(t, http.StatusBadRequest, result.Code)

	// Assert that area is saved
	var savedArea postgres.Area
	err := s.DB.Model(&savedArea).
		Where("name=?", area.Name).
		Select()
	// Should be unable to find area in db
	assert.EqualError(t, err, pg.ErrNoRows.Error())
}

func (s *AreaTestSuite) TestDeleteArea() {
	t := s.T()
	area, userId := s.GenerateArea()
	response := s.CreateRequest("DELETE", "/areas/"+area.Id, nil, &userId)
	assert.Equal(t, http.StatusOK, response.Code)
	var savedArea postgres.Area
	err := s.DB.Model(&savedArea).
		Where("id=?", area.Id).
		Select()
	assert.Error(t, err)
}

func (s *AreaTestSuite) TestDeleteUnknownArea() {
	t := s.T()
	school := s.GenerateSchool()
	response := s.CreateRequest("DELETE", "/areas/"+uuid.New().String(), nil, &school.Users[0].Id)
	assert.Equal(t, http.StatusNotFound, response.Code)
}

func (s *AreaTestSuite) TestUpdateAreaName() {
	t := s.T()
	area, userId := s.GenerateArea()

	payload := struct {
		Name string `json:"name"`
	}{uuid.New().String()}

	response := s.CreateRequest("PATCH", "/areas/"+area.Id, payload, &userId)
	assert.Equal(t, http.StatusOK, response.Code)

	var savedArea postgres.Area
	err := s.DB.Model(&savedArea).
		Where("id=?", area.Id).
		Select()
	assert.NoError(t, err)

	assert.Equal(t, payload.Name, savedArea.Name)
	assert.Equal(t, area.CurriculumId, savedArea.CurriculumId)
}

func (s *AreaTestSuite) TestUpdateInvalidAreaName() {
	t := s.T()
	area, userId := s.GenerateArea()

	payload := struct {
		Name string `json:"name"`
	}{""}
	response := s.CreateRequest("PATCH", "/areas/"+area.Id, payload, &userId)
	assert.Equal(t, http.StatusBadRequest, response.Code)

	var savedArea postgres.Area
	err := s.DB.Model(&savedArea).
		Where("id=?", area.Id).
		Select()
	assert.NoError(t, err)

	assert.Equal(t, area.Name, savedArea.Name)
	assert.Equal(t, area.CurriculumId, savedArea.CurriculumId)
}
