package curriculum_test

import (
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/go-pg/pg/v9"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"net/http"
	"net/http/httptest"
	"testing"
)

type MaterialTestSuite struct {
	baseCurriculumTestSuite
}

func TestMaterialTestSuite(t *testing.T) {
	suite.Run(t, new(MaterialTestSuite))
}

func (suite *MaterialTestSuite) TestValidPost() {
	t := suite.T()
	subject := suite.saveNewSubject()
	payload := struct {
		Name string `json:"name"`
	}{uuid.New().String()}

	suite.testRequest("POST", "/subjects/"+subject.Id+"/materials", payload)
	assert.Equal(t, http.StatusCreated, suite.w.Code)

	var savedMaterial postgres.Material
	err := suite.db.Model(&savedMaterial).Where("name=?", payload.Name).Select()
	assert.NoError(t, err)
}

func (suite *MaterialTestSuite) TestOrderingOfInsert() {
	t := suite.T()
	subject := suite.saveNewSubject()
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

			suite.testRequest("POST", "/subjects/"+subject.Id+"/materials", payload)
			assert.Equal(t, http.StatusCreated, suite.w.Code)

			var savedMaterial postgres.Material
			err := suite.db.
				Model(&savedMaterial).
				Where("name=?", payload.Name).
				Select()
			assert.NoError(t, err)
			assert.Equal(t, test.expectedOrder, savedMaterial.Order)
		})
	}
}

func (suite *MaterialTestSuite) TestInvalidPost() {
	t := suite.T()
	subject := suite.saveNewSubject()
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
			suite.w = httptest.NewRecorder()

			payload := struct {
				Name string `json:"name"`
			}{test.name}

			suite.testRequest("POST", "/subjects/"+test.subjectId+"/materials", payload)
			assert.NotEqual(t, http.StatusCreated, suite.w.Code)

			var savedMaterial postgres.Material
			err := suite.db.Model(&savedMaterial).
				Where("name=?", payload.Name).
				Select()
			assert.EqualError(t, err, pg.ErrNoRows.Error())
		})
	}
}

func (suite *MaterialTestSuite) TestValidUpdate() {
	t := suite.T()
	subject := suite.saveNewSubject()

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
			originalMaterial := suite.saveNewMaterial()

			payload := struct {
				Name      string `json:"name,omitempty"`
				SubjectId string `json:"subjectId,omitempty"`
			}{test.name, test.subjectId}

			suite.testRequest("PATCH", "/materials/"+originalMaterial.Id, payload)
			t.Log(suite.w.Body)
			assert.Equal(t, http.StatusNoContent, suite.w.Code)

			var savedMaterial postgres.Material
			err := suite.db.Model(&savedMaterial).
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

func (suite *MaterialTestSuite) TestUpdateMaterialOrderBackward() {
	t := suite.T()
	subject := suite.saveNewSubject()
	originalMaterials := []postgres.Material{
		{Id: uuid.New().String(), Name: "Major", SubjectId: subject.Id, Order: 1},
		{Id: uuid.New().String(), Name: "Tom", SubjectId: subject.Id, Order: 2},
		{Id: uuid.New().String(), Name: "To", SubjectId: subject.Id, Order: 3},
		{Id: uuid.New().String(), Name: "Ground Control", SubjectId: subject.Id, Order: 4},
	}
	for _, material := range originalMaterials {
		err := suite.db.Insert(&material)
		assert.NoError(t, err)
	}

	// Move last material to second place
	type payload struct {
		Order int `json:"order"`
	}
	suite.testRequest("PATCH", "/materials/"+originalMaterials[3].Id, payload{2})

	// Get materials, ordered by order column
	var updatedMaterials []postgres.Material
	err := suite.db.Model(&updatedMaterials).
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

func (suite *MaterialTestSuite) TestUpdateMaterialOrderForward() {
	t := suite.T()
	subject := suite.saveNewSubject()
	originalMaterials := []postgres.Material{
		{Id: uuid.New().String(), Name: "Major", SubjectId: subject.Id, Order: 1},
		{Id: uuid.New().String(), Name: "Tom", SubjectId: subject.Id, Order: 2},
		{Id: uuid.New().String(), Name: "To", SubjectId: subject.Id, Order: 3},
		{Id: uuid.New().String(), Name: "Ground Control", SubjectId: subject.Id, Order: 4},
	}
	for _, material := range originalMaterials {
		err := suite.db.Insert(&material)
		assert.NoError(t, err)
	}

	// Move last material to second place
	type payload struct {
		Order int `json:"order"`
	}
	suite.testRequest("PATCH", "/materials/"+originalMaterials[0].Id, payload{3})

	// Get materials, ordered by order column
	var updatedMaterials []postgres.Material
	err := suite.db.Model(&updatedMaterials).
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

func (suite *MaterialTestSuite) TestUpdateMaterialOrderRandomly() {
	t := suite.T()
	subject := suite.saveNewSubject()
	originalMaterials := []postgres.Material{
		{Id: uuid.New().String(), Name: "Major", SubjectId: subject.Id, Order: 1},
		{Id: uuid.New().String(), Name: "Tom", SubjectId: subject.Id, Order: 2},
		{Id: uuid.New().String(), Name: "To", SubjectId: subject.Id, Order: 3},
		{Id: uuid.New().String(), Name: "Ground Control", SubjectId: subject.Id, Order: 4},
	}
	for _, material := range originalMaterials {
		err := suite.db.Insert(&material)
		assert.NoError(t, err)
	}

	// Move last material to second place
	type payload struct {
		Order int `json:"order"`
	}
	suite.testRequest("PATCH", "/materials/"+originalMaterials[0].Id, payload{2})
	assert.Equal(t, http.StatusNoContent, suite.w.Code)
	suite.testRequest("PATCH", "/materials/"+originalMaterials[0].Id, payload{3})
	assert.Equal(t, http.StatusNoContent, suite.w.Code)
	suite.testRequest("PATCH", "/materials/"+originalMaterials[0].Id, payload{1})
	assert.Equal(t, http.StatusNoContent, suite.w.Code)
	suite.testRequest("PATCH", "/materials/"+originalMaterials[0].Id, payload{4})
	assert.Equal(t, http.StatusNoContent, suite.w.Code)
	suite.testRequest("PATCH", "/materials/"+originalMaterials[3].Id, payload{1})
	assert.Equal(t, http.StatusNoContent, suite.w.Code)

	// Get materials, ordered by order column
	var updatedMaterials []postgres.Material
	err := suite.db.Model(&updatedMaterials).
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
