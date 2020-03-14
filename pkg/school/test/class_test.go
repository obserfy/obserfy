package school_test

import (
	"github.com/brianvoe/gofakeit/v4"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/google/uuid"
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
		Weekday   []time.Weekday `json:"weekday"`
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

	session := postgres.Session{
		uuid.New().String(),
		newSchool.Users[0].Id,
	}
	result := s.CreateRequest("POST", "/"+newSchool.Id+"/class", payload, &session)
	assert.Equal(t, http.StatusCreated, result.Code)

	var class postgres.Class
	err := s.DB.Model(&class).
		Where("name=?", payload.Name).
		Select()
	assert.NoError(t, err)
	assert.Equal(t, payload.EndTime.Unix(), class.EndTime.Unix())
	assert.Equal(t, payload.StartTime.Unix(), class.StartTime.Unix())
	assert.Equal(t, newSchool.Id, class.SchoolId)
}
