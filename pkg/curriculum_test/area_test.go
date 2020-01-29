package curriculum_test

import (
	"github.com/chrsep/vor/pkg/curriculum"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-pg/pg/v9"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"testing"
)

func connectTestDB() *pg.DB {
	return postgres.Connect(
		"postgres",
		"developmentonly",
		"localhost:5432",
		nil,
	)
}

func createTestArea() postgres.Area {
	return postgres.Area{
		Id:           uuid.New().String(),
		CurriculumId: "",
		Curriculum:   postgres.Curriculum{},
		Name:         "",
		Subjects:     nil,
	}
}

// Not existent area should return 404
func TestGetExistingArea(t *testing.T) {
	area := createTestArea()
	db := connectTestDB()
	err := db.Insert(&area)
	assert.NoError(t, err)

	store := postgres.CurriculumStore{db}
	server := rest.Server{}
	handler := curriculum.NewRouter(server, store)

	assert.HTTPSuccess(t, handler.ServeHTTP, "GET", "/areas/"+area.Id, nil)
}

// Not existent area should return 404
func TestGetNonExistentArea(t *testing.T) {
	db := connectTestDB()
	store := postgres.CurriculumStore{db}
	server := rest.Server{}
	handler := curriculum.NewRouter(server, store)

	assert.HTTPSuccess(t, handler.ServeHTTP, "GET", "/areas/"+uuid.New().String(), nil)
}
