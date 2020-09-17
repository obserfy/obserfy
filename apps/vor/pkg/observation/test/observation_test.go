package observation_test

import (
	"encoding/json"
	"github.com/chrsep/vor/pkg/minio"
	"net/http"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"

	"github.com/chrsep/vor/pkg/observation"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/testutils"
)

type ObservationTestSuite struct {
	testutils.BaseTestSuite

	store postgres.ObservationStore
}

func (s *ObservationTestSuite) SetupTest() {
	client, err := minio.NewClient()
	assert.NoError(s.T(), err)
	s.store = postgres.ObservationStore{s.DB, minio.NewImageStorage(client)}
	s.Handler = observation.NewRouter(s.Server, s.store).ServeHTTP
}

func TestObservation(t *testing.T) {
	suite.Run(t, new(ObservationTestSuite))
}

func (s *ObservationTestSuite) TestGetObservation() {
	t := s.T()
	o := s.GenerateObservation()

	w := s.CreateRequest("GET", "/"+o.Id, nil, &o.CreatorId)
	assert.Equal(t, http.StatusOK, w.Code)
	var body struct {
		Id          string     `json:"id"`
		StudentName string     `json:"studentName"`
		CategoryId  string     `json:"categoryId"`
		CreatorId   string     `json:"creatorId"`
		CreatorName string     `json:"creatorName"`
		LongDesc    string     `json:"longDesc"`
		ShortDesc   string     `json:"shortDesc"`
		EventTime   *time.Time `json:"eventTime"`
		CreatedDate *time.Time `json:"createdDate"`
	}
	err := json.NewDecoder(w.Body).Decode(&body)
	assert.NoError(t, err)
	assert.Equal(t, o.Id, body.Id)
	assert.Equal(t, o.Student.Name, body.StudentName)
	assert.Equal(t, o.CategoryId, body.CategoryId)
	assert.Equal(t, o.CreatorId, body.CreatorId)
	assert.Equal(t, o.Creator.Name, body.CreatorName)
	assert.Equal(t, o.LongDesc, body.LongDesc)
	assert.Equal(t, o.ShortDesc, body.ShortDesc)
	assert.Equal(t, o.EventTime.Unix(), body.EventTime.Unix())
	assert.Equal(t, o.CreatedDate.Unix(), body.CreatedDate.Unix())
}

func (s *ObservationTestSuite) TestInvalidGetObservation() {
	school := s.GenerateSchool()
	tests := []struct {
		name          string
		observationId string
	}{
		{"empty id", ""},
		{"random gibberish", "adshfjkalewuidhakjs"},
		{"unknown id", uuid.New().String()},
	}
	for _, test := range tests {
		s.T().Run(test.name, func(t *testing.T) {
			w := s.CreateRequest("GET", "/"+uuid.New().String(), nil, &school.Users[0].Id)
			assert.Equal(t, http.StatusNotFound, w.Code)
		})
	}
}
