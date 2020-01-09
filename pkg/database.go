package main

import (
	"crypto/tls"
	"github.com/go-pg/pg/v9"
	"github.com/go-pg/pg/v9/orm"
	"go.uber.org/zap"
	"os"
)

func getDBConnection() *pg.DB {
	return pg.Connect(&pg.Options{
		User:      os.Getenv("DB_USERNAME"),
		Password:  os.Getenv("DB_PASSWORD"),
		Addr:      os.Getenv("DB_HOST") + ":" + os.Getenv("DB_PORT"),
		Database:  "defaultdb",
		TLSConfig: &tls.Config{InsecureSkipVerify: true},
	})
}

func createSchema(env Env) {
	for _, model := range []interface{}{
		(*Student)(nil),
		// Curriculum related tables
		(*Curriculum)(nil),
		(*Area)(nil),
		(*Subject)(nil),
		(*Material)(nil),
		(*StudentMaterialProgress)(nil),

		(*Observation)(nil),
		(*User)(nil),
		(*Session)(nil),
		(*School)(nil),
		(*UserToSchool)(nil),
	} {
		err := env.db.CreateTable(model, &orm.CreateTableOptions{IfNotExists: true, FKConstraints: true})
		if err != nil {
			env.logger.Error("Failed creating table", zap.Error(err))
		}
	}
}

func closeDB(db *pg.DB, logger *zap.Logger) {
	err := db.Close()
	if err != nil {
		logger.Error("Error closing db", zap.Error(err))
	}
}
