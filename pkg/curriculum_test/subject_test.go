package curriculum_test

import (
	"bytes"
	"encoding/json"
	"github.com/chrsep/vor/pkg/curriculum"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"net/http"
	"net/http/httptest"
	"testing"
)

// Add New subject test
type SubjectTestSuite struct {
	baseCurriculumTestSuite
}

func TestSubjectTestSuite(t *testing.T) {
	suite.Run(t, new(SubjectTestSuite))
}

func (s *SubjectTestSuite) TestCreateSubject() {
	t := s.T()
	area := s.saveNewArea()

	payload := curriculum.SubjectJson{
		Name:   uuid.New().String(),
		AreaId: area.Id,
	}
	s.testRequest("POST", "/areas/"+payload.AreaId+"/subjects", payload)
	assert.Equal(t, http.StatusCreated, s.w.Code)

	// get subject
	var savedSubject postgres.Subject
	err := s.db.
		Model(&savedSubject).
		Where("name=?", payload.Name).
		Select()
	assert.NoError(t, err)
	assert.Equal(t, payload.Name, savedSubject.Name)
	assert.Equal(t, payload.AreaId, savedSubject.AreaId)
	assert.Equal(t, 1, savedSubject.Order)

	secondPayload := curriculum.SubjectJson{
		Name:   uuid.New().String(),
		AreaId: area.Id,
	}
	s.testRequest("POST", "/areas/"+secondPayload.AreaId+"/subjects", secondPayload)
	assert.Equal(t, http.StatusCreated, s.w.Code)
	// get subject
	var secondSavedSubject postgres.Subject
	err = s.db.
		Model(&secondSavedSubject).
		Where("name=?", secondPayload.Name).
		Select()
	assert.NoError(t, err)
	assert.Equal(t, secondPayload.Name, secondSavedSubject.Name)
	assert.Equal(t, secondPayload.AreaId, secondSavedSubject.AreaId)
	assert.Equal(t, 2, secondSavedSubject.Order)
}

func (s *SubjectTestSuite) TestUpdateSubject() {
	t := s.T()
	original := s.saveNewSubject()

	// Try changing the name using the API
	payload := curriculum.SubjectJson{Name: uuid.New().String()}
	s.testRequest("PATCH", "/subjects/"+original.Id, payload)

	// Get current data on db
	var updated postgres.Subject
	err := s.db.Model(&updated).
		Where("id=?", original.Id).
		Select()
	assert.NoError(t, err)

	assert.Equal(t, http.StatusNoContent, s.w.Code)
	assert.EqualValues(t, payload.Name, updated.Name)      // Name should be updated
	assert.EqualValues(t, original.AreaId, updated.AreaId) // Other values should stay the same
}

// AddSubject should have name
func (s *SubjectTestSuite) TestCreateSubjectWithNoName() {
	t := s.T()
	area := s.saveNewArea()

	payload := curriculum.SubjectJson{AreaId: area.Id}
	s.testRequest("POST", "/areas/"+payload.AreaId+"/subjects", payload)
	assert.EqualValues(t, http.StatusBadRequest, s.w.Code)
}

func (s *SubjectTestSuite) TestUpdateNonexistentArea() {
	t := s.T()
	original := s.saveNewSubject()

	payload := curriculum.SubjectJson{AreaId: uuid.New().String()}
	s.testRequest("PATCH", "/subjects/"+original.Id, payload)
	assert.EqualValues(t, http.StatusUnprocessableEntity, s.w.Code)

	var updated postgres.Subject
	err := s.db.Model(&updated).Where("id=?", original.Id).Select()
	assert.NoError(t, err)

	assert.Equal(t, original.AreaId, updated.AreaId)
	assert.Equal(t, original.Name, updated.Name)
}

func (s *SubjectTestSuite) TestValidArea() {
	t := s.T()
	original := s.saveNewSubject()
	newArea := s.saveNewArea()

	payload := curriculum.SubjectJson{AreaId: newArea.Id}
	s.testRequest("PATCH", "/subjects/"+original.Id, payload)
	assert.EqualValues(t, http.StatusNoContent, s.w.Code)

	var updated postgres.Subject
	err := s.db.Model(&updated).Where("id=?", original.Id).Select()
	assert.NoError(t, err)

	assert.Equal(t, payload.AreaId, updated.AreaId)
	assert.Equal(t, original.Name, updated.Name)
}

// AddSubject should have area
func (s *SubjectTestSuite) TestUpdateName() {
	t := s.T()
	original := s.saveNewSubject()
	payload := curriculum.SubjectJson{Name: uuid.New().String()}

	s.testRequest("PATCH", "/subjects/"+original.Id, payload)
	assert.EqualValues(t, http.StatusNoContent, s.w.Code)

	var updated postgres.Subject
	err := s.db.Model(&updated).Where("id=?", original.Id).Select()
	assert.NoError(t, err)

	assert.Equal(t, payload.Name, updated.Name)
	assert.Equal(t, original.AreaId, updated.AreaId)
}

/////////////////////////////////
// Helper functions
/////////////////////////////////
func (s *SubjectTestSuite) saveNewSubject() postgres.Subject {
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

func (s *SubjectTestSuite) saveNewArea() postgres.Area {
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

func (s *SubjectTestSuite) testRequest(method string, path string, bodyJson interface{}) {
	body, err := json.Marshal(bodyJson)
	assert.NoError(s.T(), err)

	req := httptest.NewRequest(method, path, bytes.NewBuffer(body))
	s.handler(s.w, req)
}
