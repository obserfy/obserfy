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
	area, userId := s.saveNewArea()

	payload := curriculum.SubjectJson{
		Name:   uuid.New().String(),
		AreaId: area.Id,
	}
	result := s.CreateRequest("POST", "/areas/"+payload.AreaId+"/subjects", payload, &userId)
	assert.Equal(t, http.StatusCreated, result.Code)

	// get subject
	var savedSubject postgres.Subject
	err := s.DB.
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
	result = s.CreateRequest("POST", "/areas/"+secondPayload.AreaId+"/subjects", secondPayload, &userId)
	assert.Equal(t, http.StatusCreated, result.Code)
	// get subject
	var secondSavedSubject postgres.Subject
	err = s.DB.
		Model(&secondSavedSubject).
		Where("name=?", secondPayload.Name).
		Select()
	assert.NoError(t, err)
	assert.Equal(t, secondPayload.Name, secondSavedSubject.Name)
	assert.Equal(t, secondPayload.AreaId, secondSavedSubject.AreaId)
	assert.Equal(t, 2, secondSavedSubject.Order)
}

// AddSubject should have name
func (s *SubjectTestSuite) TestCreateSubjectWithNoName() {
	t := s.T()
	area, userId := s.saveNewArea()

	payload := curriculum.SubjectJson{AreaId: area.Id}
	result := s.CreateRequest("POST", "/areas/"+payload.AreaId+"/subjects", payload, &userId)
	assert.EqualValues(t, http.StatusBadRequest, result.Code)
}

func (s *SubjectTestSuite) TestCreateNewSubjectWithMaterials() {
	t := s.T()
	area, userId := s.saveNewArea()

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
	result := s.CreateRequest("POST", "/areas/"+area.Id+"/subjects", payload, &userId)
	assert.Equal(t, http.StatusCreated, result.Code)

	// get subject
	var savedSubject postgres.Subject
	err := s.DB.
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
	area, userId := s.saveNewArea()

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
	result := s.CreateRequest("POST", "/areas/"+area.Id+"/subjects", payload, &userId)
	// Don't allow repeated order number
	assert.Equal(t, http.StatusUnprocessableEntity, result.Code)

	// Verify subject is not saved
	var savedSubject postgres.Subject
	err := s.DB.
		Model(&savedSubject).
		Where("name=?", payload.Name).
		Relation("Materials").
		Select()
	assert.Error(t, err)
}

func (s *SubjectTestSuite) TestDeleteSubject() {
	t := s.T()
	subject, userId := s.saveNewSubject()
	result := s.CreateRequest("DELETE", "/subjects/"+subject.Id, nil, &userId)
	assert.Equal(t, http.StatusOK, result.Code)
	var savedSubject postgres.Subject
	err := s.DB.Model(&savedSubject).
		Where("id=?", subject.Id).
		Select()
	assert.Error(t, err)
}

func (s *SubjectTestSuite) TestDeleteUnknownSubject() {
	t := s.T()
	school := s.SaveNewSchool()
	subjectId := uuid.New().String()
	result := s.CreateRequest("DELETE", "/subjects/"+subjectId, nil, &school.Users[0].Id)
	assert.Equal(t, http.StatusNotFound, result.Code)
}

func (s *SubjectTestSuite) TestPutSubjectWithRemovedMaterial() {
	t := s.T()
	material, userId := s.saveNewMaterial()

	type materialPayload struct {
		Name  string `json:"name"`
		Order int    `json:"order"`
	}
	type subjectPayload struct {
		Name      string `json:"name"`
		Order     int    `json:"order"`
		AreaId    string `json:"areaId"`
		Materials []materialPayload
	}
	newSubject := subjectPayload{
		Name:   uuid.New().String(),
		Order:  0,
		AreaId: material.Subject.Area.Id,
	}
	result := s.CreateRequest("PUT", "/subjects/"+material.Subject.Id, newSubject, &userId)
	assert.Equal(t, http.StatusOK, result.Code)

	var savedSubject postgres.Subject
	err := s.DB.Model(&savedSubject).
		Where("id=?", material.Subject.Id).
		Relation("Materials").
		Select()
	assert.NoError(t, err)
	assert.Equal(t, newSubject.Name, savedSubject.Name)
	assert.Equal(t, len(newSubject.Materials), len(savedSubject.Materials))
}

func (s *SubjectTestSuite) TestPutSubjectWithNewMaterial() {
	t := s.T()
	material, userId := s.saveNewMaterial()

	type materialPayload struct {
		Id    string `json:"id"`
		Name  string `json:"name"`
		Order int    `json:"order"`
	}
	type subjectPayload struct {
		Name      string `json:"name"`
		Order     int    `json:"order"`
		AreaId    string `json:"areaId"`
		Materials []materialPayload
	}
	newSubject := subjectPayload{
		Name:   uuid.New().String(),
		Order:  0,
		AreaId: material.Subject.Area.Id,
		Materials: []materialPayload{
			{material.Id, material.Name, material.Order},
			{uuid.New().String(), uuid.New().String(), material.Order + 1},
			{uuid.New().String(), uuid.New().String(), material.Order + 2},
			{uuid.New().String(), uuid.New().String(), material.Order + 3},
		},
	}
	result := s.CreateRequest("PUT", "/subjects/"+material.Subject.Id, newSubject, &userId)
	assert.Equal(t, http.StatusOK, result.Code)

	var savedSubject postgres.Subject
	err := s.DB.Model(&savedSubject).
		Where("id=?", material.Subject.Id).
		Relation("Materials").
		Select()
	assert.NoError(t, err)
	assert.Equal(t, newSubject.Name, savedSubject.Name)
	assert.Equal(t, len(newSubject.Materials), len(savedSubject.Materials))
}

func (s *SubjectTestSuite) TestPutSubjectWithUpdatedMaterial() {
	t := s.T()
	material, userId := s.saveNewMaterial()

	type materialPayload struct {
		Id    string `json:"id"`
		Name  string `json:"name"`
		Order int    `json:"order"`
	}
	type subjectPayload struct {
		Name      string `json:"name"`
		Order     int    `json:"order"`
		AreaId    string `json:"areaId"`
		Materials []materialPayload
	}
	newSubject := subjectPayload{
		Name:   uuid.New().String(),
		Order:  0,
		AreaId: material.Subject.Area.Id,
		Materials: []materialPayload{
			{material.Id, uuid.New().String(), material.Order},
		},
	}
	response := s.CreateRequest("PUT", "/subjects/"+material.Subject.Id, newSubject, &userId)
	assert.Equal(t, http.StatusOK, response.Code)

	var savedSubject postgres.Subject
	err := s.DB.Model(&savedSubject).
		Where("id=?", material.Subject.Id).
		Relation("Materials").
		Select()
	assert.NoError(t, err)
	assert.Equal(t, newSubject.Name, savedSubject.Name)
	assert.Equal(t, len(newSubject.Materials), len(savedSubject.Materials))
}
