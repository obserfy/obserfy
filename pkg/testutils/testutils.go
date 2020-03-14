package testutils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-pg/pg/v9"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap/zaptest"
	"net/http"
	"net/http/httptest"
	"time"
)

type BaseTestSuite struct {
	suite.Suite
	DB      *pg.DB
	Handler http.HandlerFunc
	Server  rest.Server
}

func (s *BaseTestSuite) TearDownSuite() {
	if err := s.DB.Close(); err != nil {
		assert.NoError(s.T(), err)
	}
}

func (s *BaseTestSuite) SetupSuite() {
	db, err := connectTestDB()
	assert.NoError(s.T(), err)
	s.DB = db
	s.Server = rest.NewServer(zaptest.NewLogger(s.T()))
}

func connectTestDB() (*pg.DB, error) {
	db := postgres.Connect(
		"postgres",
		"postgres",
		"localhost:5432",
		nil,
	)

	// Wait until connection is healthy
	for {
		_, err := db.Exec("SELECT 1")
		if err == nil {
			break
		} else {
			fmt.Println("Error: PostgreSQL is down")
			fmt.Println(err)
			time.Sleep(1000 * time.Millisecond)
		}
	}

	err := postgres.InitTables(db)
	if err != nil {
		return nil, err
	}
	return db, nil
}

func (s *BaseTestSuite) CreateRequest(method string, path string, bodyJson interface{}) *httptest.ResponseRecorder {
	w := httptest.NewRecorder()
	body, err := json.Marshal(bodyJson)
	assert.NoError(s.T(), err)

	req := httptest.NewRequest(method, path, bytes.NewBuffer(body))
	s.Handler(w, req)
	return w
}
