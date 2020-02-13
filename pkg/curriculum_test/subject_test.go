package curriculum_test

import (
	"github.com/chrsep/vor/pkg/curriculum"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"net/http"
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

func (s *SubjectTestSuite) TestCreateNewSubjectWithMaterials() {
	t := s.T()
	area := s.saveNewArea()

	type materialPayload struct {
		Name  string `json:"name"`
		Order int    `json:"order"`
	}
	type subjectPayload struct {
		Name      string `json:"name"`
		Materials []materialPayload
	}
	payload := subjectPayload{
		Name: uuid.New().String(),
		Materials: []materialPayload{
			{Name: "Test", Order: 1},
			{Name: "Test", Order: 2},
		},
	}
	s.testRequest("POST", "/areas/"+area.Id+"/subjects", payload)
	assert.Equal(t, http.StatusCreated, s.w.Code)

	// get subject
	var savedSubject postgres.Subject
	err := s.db.
		Model(&savedSubject).
		Where("name=?", payload.Name).
		Relation("Materials").
		Select()
	assert.NoError(t, err)
	assert.Equal(t, payload.Name, savedSubject.Name)
	assert.Equal(t, area.Id, savedSubject.AreaId)
	assert.Equal(t, 1, savedSubject.Order)
	assert.Equal(t, len(payload.Materials), len(savedSubject.Materials))

}

func (s *SubjectTestSuite) TestCreateNewSubjectWithMaterialsWithRepeatedOrder() {
	t := s.T()
	area := s.saveNewArea()

	type materialPayload struct {
		Name  string `json:"name"`
		Order int    `json:"order"`
	}
	type subjectPayload struct {
		Name      string `json:"name"`
		Materials []materialPayload
	}
	payload := subjectPayload{
		Name: uuid.New().String(),
		Materials: []materialPayload{
			{Name: "Test", Order: 1},
			{Name: "Test", Order: 1},
		},
	}
	s.testRequest("POST", "/areas/"+area.Id+"/subjects", payload)
	// Don't allow repeated order number
	assert.Equal(t, http.StatusUnprocessableEntity, s.w.Code)

	// Verify subject is not saved
	var savedSubject postgres.Subject
	err := s.db.
		Model(&savedSubject).
		Where("name=?", payload.Name).
		Relation("Materials").
		Select()
	assert.Error(t, err)
	//assert.Equal(t, payload.Name, savedSubject.Name)
	//assert.Equal(t, area.Id, savedSubject.AreaId)
	//assert.Equal(t, 1, savedSubject.Order)
	//assert.Equal(t, len(payload.Materials), len(savedSubject.Materials))
}
