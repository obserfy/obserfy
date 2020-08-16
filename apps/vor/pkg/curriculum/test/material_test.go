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

type MaterialTestSuite struct {
	baseCurriculumTestSuite
}

func TestMaterialTestSuite(t *testing.T) {
	suite.Run(t, new(MaterialTestSuite))
}

func (s *MaterialTestSuite) TestValidPost() {
	t := s.T()
	subject, userId := s.GenerateSubject()

	payload := struct {
		Name string `json:"name"`
	}{uuid.New().String()}

	result := s.CreateRequest("POST", "/subjects/"+subject.Id+"/materials", payload, &userId)
	assert.Equal(t, http.StatusCreated, result.Code)

	var savedMaterial postgres.Material
	err := s.DB.Model(&savedMaterial).Where("name=?", payload.Name).Select()
	assert.NoError(t, err)
}

func (s *MaterialTestSuite) TestOrderingOfInsert() {
	t := s.T()
	subject, userId := s.GenerateSubject()
	tests := []struct {
		name          string
		materialName  string
		expectedOrder int
	}{
		{"First", uuid.New().String(), 1},
		{"Second", uuid.New().String(), 2},
		{"Third", uuid.New().String(), 3},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			payload := struct {
				Name string `json:"name"`
			}{test.materialName}

			result := s.CreateRequest("POST", "/subjects/"+subject.Id+"/materials", payload, &userId)
			assert.Equal(t, http.StatusCreated, result.Code)

			var savedMaterial postgres.Material
			err := s.DB.
				Model(&savedMaterial).
				Where("name=?", payload.Name).
				Select()
			assert.NoError(t, err)
			assert.Equal(t, test.expectedOrder, savedMaterial.Order)
		})
	}
}

func (s *MaterialTestSuite) TestInvalidCreateSubject() {
	t := s.T()
	subject, userId := s.GenerateSubject()
	tests := []struct {
		testName  string
		name      string
		subjectId string
	}{
		{testName: "Invalid subject ID", name: uuid.New().String(), subjectId: "asfd"},
		{testName: "Non-existent subject", name: uuid.New().String(), subjectId: uuid.New().String()},
		{testName: "Invalid name", name: "", subjectId: subject.Id},
	}
	for _, test := range tests {
		t.Run(test.testName, func(t *testing.T) {
			payload := struct {
				Name string `json:"name"`
			}{test.name}

			result := s.CreateRequest("POST", "/subjects/"+test.subjectId+"/materials", payload, &userId)
			assert.NotEqual(t, http.StatusCreated, result.Code)

			var savedMaterial postgres.Material
			err := s.DB.Model(&savedMaterial).
				Where("name=?", payload.Name).
				Select()
			assert.EqualError(t, err, pg.ErrNoRows.Error())
		})
	}
}

func (s *MaterialTestSuite) TestValidUpdate() {
	t := s.T()
	subject, _ := s.GenerateSubject()

	tests := []struct {
		testName  string
		name      string
		subjectId string
	}{
		{testName: "update name", name: uuid.New().String()},
		{testName: "Update subject", subjectId: subject.Id},
	}
	for _, test := range tests {
		t.Run(test.testName, func(t *testing.T) {
			originalMaterial, userId := s.GenerateMaterial()

			payload := struct {
				Name      string `json:"name,omitempty"`
				SubjectId string `json:"subjectId,omitempty"`
			}{test.name, test.subjectId}

			result := s.CreateRequest("PATCH", "/materials/"+originalMaterial.Id, payload, &userId)
			t.Log(result.Body)
			assert.Equal(t, http.StatusNoContent, result.Code)

			var savedMaterial postgres.Material
			err := s.DB.Model(&savedMaterial).
				Where("id=?", originalMaterial.Id).
				Select()
			assert.NoError(t, err)

			// name shouldn't change when payload has empty name field
			if payload.Name == "" {
				assert.Equal(t, originalMaterial.Name, savedMaterial.Name)
			} else {
				assert.Equal(t, payload.Name, savedMaterial.Name)
			}

			// subjectId shouldn't change when payload has empty subjectId field
			if payload.SubjectId == "" {
				assert.Equal(t, originalMaterial.SubjectId, savedMaterial.SubjectId)
			} else {
				assert.Equal(t, payload.SubjectId, savedMaterial.SubjectId)
			}
		})
	}
}

func (s *MaterialTestSuite) TestUpdateMaterialOrderBackward() {
	t := s.T()
	subject, userId := s.GenerateSubject()
	originalMaterials := []postgres.Material{
		{Id: uuid.New().String(), Name: "Major", SubjectId: subject.Id, Order: 1},
		{Id: uuid.New().String(), Name: "Tom", SubjectId: subject.Id, Order: 2},
		{Id: uuid.New().String(), Name: "To", SubjectId: subject.Id, Order: 3},
		{Id: uuid.New().String(), Name: "Ground Control", SubjectId: subject.Id, Order: 4},
	}
	for _, material := range originalMaterials {
		err := s.DB.Insert(&material)
		assert.NoError(t, err)
	}

	// Move last material to second place
	type payload struct {
		Order int `json:"order"`
	}
	result := s.CreateRequest("PATCH", "/materials/"+originalMaterials[3].Id, payload{2}, &userId)
	assert.Equal(t, http.StatusNoContent, result.Code)

	// Get materials, ordered by order column
	var updatedMaterials []postgres.Material
	err := s.DB.Model(&updatedMaterials).
		Where("subject_id=?", subject.Id).
		Order("order").
		Select()
	assert.NoError(t, err)
	assert.Len(t, updatedMaterials, 4)

	// Test last material correctly moved to second place
	assert.Equal(t, originalMaterials[0].Name, updatedMaterials[0].Name)
	assert.Equal(t, originalMaterials[3].Name, updatedMaterials[1].Name)
	assert.Equal(t, originalMaterials[1].Name, updatedMaterials[2].Name)
	assert.Equal(t, originalMaterials[2].Name, updatedMaterials[3].Name)

	// Make sure no order numbers overlap
	for i, material := range updatedMaterials {
		for j, otherMaterial := range updatedMaterials {
			if i != j {
				assert.NotEqual(t, material.Order, otherMaterial.Order)
			}
		}
	}
}

func (s *MaterialTestSuite) TestUpdateMaterialOrderForward() {
	t := s.T()
	subject, userId := s.GenerateSubject()
	originalMaterials := []postgres.Material{
		{Id: uuid.New().String(), Name: "Major", SubjectId: subject.Id, Order: 1},
		{Id: uuid.New().String(), Name: "Tom", SubjectId: subject.Id, Order: 2},
		{Id: uuid.New().String(), Name: "To", SubjectId: subject.Id, Order: 3},
		{Id: uuid.New().String(), Name: "Ground Control", SubjectId: subject.Id, Order: 4},
	}
	for _, material := range originalMaterials {
		err := s.DB.Insert(&material)
		assert.NoError(t, err)
	}

	// Move last material to second place
	type payload struct {
		Order int `json:"order"`
	}
	s.CreateRequest("PATCH", "/materials/"+originalMaterials[0].Id, payload{3}, &userId)

	// Get materials, ordered by order column
	var updatedMaterials []postgres.Material
	err := s.DB.Model(&updatedMaterials).
		Where("subject_id=?", subject.Id).
		Order("order").
		Select()
	assert.NoError(t, err)
	assert.Len(t, updatedMaterials, 4)

	// Test first material correctly moved to third place
	assert.Equal(t, originalMaterials[1].Name, updatedMaterials[0].Name)
	assert.Equal(t, originalMaterials[2].Name, updatedMaterials[1].Name)
	assert.Equal(t, originalMaterials[0].Name, updatedMaterials[2].Name)
	assert.Equal(t, originalMaterials[3].Name, updatedMaterials[3].Name)

	// Make sure no order numbers overlap
	for i, material := range updatedMaterials {
		for j, otherMaterial := range updatedMaterials {
			if i != j {
				assert.NotEqual(t, material.Order, otherMaterial.Order)
			}
		}
	}
}

func (s *MaterialTestSuite) TestUpdateMaterialOrderRandomly() {
	t := s.T()
	subject, userId := s.GenerateSubject()
	originalMaterials := []postgres.Material{
		{Id: uuid.New().String(), Name: "Major", SubjectId: subject.Id, Order: 1},
		{Id: uuid.New().String(), Name: "Tom", SubjectId: subject.Id, Order: 2},
		{Id: uuid.New().String(), Name: "To", SubjectId: subject.Id, Order: 3},
		{Id: uuid.New().String(), Name: "Ground Control", SubjectId: subject.Id, Order: 4},
	}
	for _, material := range originalMaterials {
		err := s.DB.Insert(&material)
		assert.NoError(t, err)
	}

	// Move last material to second place
	type payload struct {
		Order int `json:"order"`
	}
	result := s.CreateRequest("PATCH", "/materials/"+originalMaterials[0].Id, payload{2}, &userId)
	assert.Equal(t, http.StatusNoContent, result.Code)
	result = s.CreateRequest("PATCH", "/materials/"+originalMaterials[0].Id, payload{3}, &userId)
	assert.Equal(t, http.StatusNoContent, result.Code)
	result = s.CreateRequest("PATCH", "/materials/"+originalMaterials[0].Id, payload{1}, &userId)
	assert.Equal(t, http.StatusNoContent, result.Code)
	result = s.CreateRequest("PATCH", "/materials/"+originalMaterials[0].Id, payload{4}, &userId)
	assert.Equal(t, http.StatusNoContent, result.Code)
	result = s.CreateRequest("PATCH", "/materials/"+originalMaterials[3].Id, payload{1}, &userId)
	assert.Equal(t, http.StatusNoContent, result.Code)

	// Get materials, ordered by order column
	var updatedMaterials []postgres.Material
	err := s.DB.Model(&updatedMaterials).
		Where("subject_id=?", subject.Id).
		Order("order").
		Select()
	assert.NoError(t, err)
	assert.Len(t, updatedMaterials, 4)

	// Test first material correctly moved to third place
	assert.Equal(t, originalMaterials[3].Name, updatedMaterials[0].Name)
	assert.Equal(t, originalMaterials[1].Name, updatedMaterials[1].Name)
	assert.Equal(t, originalMaterials[2].Name, updatedMaterials[2].Name)
	assert.Equal(t, originalMaterials[0].Name, updatedMaterials[3].Name)

	// Make sure no order numbers overlap
	for i, material := range updatedMaterials {
		for j, otherMaterial := range updatedMaterials {
			if i != j {
				assert.NotEqual(t, material.Order, otherMaterial.Order)
			}
		}
	}
}
