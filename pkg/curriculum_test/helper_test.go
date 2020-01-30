package curriculum_test

import (
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/go-pg/pg/v9"
)

func connectTestDB() (*pg.DB, error) {
	db := postgres.Connect(
		"postgres",
		"postgres",
		"localhost:5432",
		nil,
	)
	err := postgres.InitTables(db)
	if err != nil {
		return nil, err
	}
	return db, nil
}

