package school_test

import (
	"encoding/json"
	"github.com/brianvoe/gofakeit/v4"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/stretchr/testify/assert"
	"net/http"
	"time"
)

func (s *SchoolTestSuite) TestValidCreateClass() {
	t := s.T()

	gofakeit.Seed(time.Now().UnixNano())
	newSchool := s.SaveNewSchool()
	payload := struct {
		Name      string         `json:"name"`
		StartTime time.Time      `json:"startTime"`
		EndTime   time.Time      `json:"endTime"`
		Weekdays  []time.Weekday `json:"weekdays"`
	}{
		gofakeit.Company(),
		time.Now(),
		time.Now().Add(time.Hour * 2),
		[]time.Weekday{
			time.Friday,
			time.Monday,
			time.Thursday,
		},
	}

	result := s.CreateRequest("POST", "/"+newSchool.Id+"/classes", payload, &newSchool.Users[0].Id)
	assert.Equal(t, http.StatusCreated, result.Code)

	var class postgres.Class
	err := s.DB.Model(&class).
		Relation("Weekdays").
		Where("name=?", payload.Name).
		Select()
	assert.NoError(t, err)
	assert.Equal(t, payload.EndTime.Unix(), class.EndTime.Unix())
	assert.Equal(t, payload.StartTime.Unix(), class.StartTime.Unix())
	assert.Equal(t, len(payload.Weekdays), len(class.Weekdays))
	assert.Equal(t, newSchool.Id, class.SchoolId)
}

func (s *SchoolTestSuite) TestGetClass() {
	t := s.T()

	gofakeit.Seed(time.Now().UnixNano())
	newSchool := s.SaveNewSchool()
	classes := []*postgres.Class{
		s.SaveNewClass(*newSchool),
		s.SaveNewClass(*newSchool),
		s.SaveNewClass(*newSchool),
		s.SaveNewClass(*newSchool),
		s.SaveNewClass(*newSchool),
	}

	result := s.CreateRequest("GET", "/"+newSchool.Id+"/classes", nil, &newSchool.Users[0].Id)
	var response []struct {
		Id        string         `json:"id"`
		Name      string         `json:"name"`
		StartTime time.Time      `json:"startTime"`
		EndTime   time.Time      `json:"endTime"`
		Weekdays  []time.Weekday `json:"weekdays"`
	}
	err := json.NewDecoder(result.Body).Decode(&response)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, result.Code)
	assert.Equal(t, len(classes), len(response))
}

func (s *SchoolTestSuite) TestGetEmptyClass() {
	t := s.T()

	gofakeit.Seed(time.Now().UnixNano())
	newSchool := s.SaveNewSchool()

	result := s.CreateRequest("GET", "/"+newSchool.Id+"/classes", nil, &newSchool.Users[0].Id)
	var response []struct {
		Id        string         `json:"id"`
		Name      string         `json:"name"`
		StartTime time.Time      `json:"startTime"`
		EndTime   time.Time      `json:"endTime"`
		Weekdays  []time.Weekday `json:"weekdays"`
	}
	err := json.NewDecoder(result.Body).Decode(&response)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, result.Code)
	assert.Equal(t, 0, len(response))
}
