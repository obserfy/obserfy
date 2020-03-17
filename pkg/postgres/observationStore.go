package postgres

import (
	"github.com/go-pg/pg/v9"
	"github.com/go-pg/pg/v9/orm"
	richErrors "github.com/pkg/errors"
)

type ObservationStore struct {
	*pg.DB
}

func (o ObservationStore) GetObservation(id string) (*Observation, error) {
	var observation Observation
	if err := o.Model(&observation).
		Where("Observation.id=?", id).
		Relation("Creator").
		Relation("Student").
		Select(); err == pg.ErrNoRows {
		return nil, nil
	} else if err != nil {
		return nil, richErrors.Wrap(err, "failed getting observation")
	}
	return &observation, nil
}
func (s ObservationStore) CheckPermissions(observationId string, userId string) (bool, error) {

	var observation Observation

	if err := s.Model(&observation).
		Relation("Student").
		Relation("Student.School.Users", func(q *orm.Query) (*orm.Query, error) {
			return q.Where("user_id = ?", userId), nil
		}).
		Where("observation.id=?", observationId).
		Select(); err == pg.ErrNoRows {
		return false, nil
	} else if err != nil {
		return false, err
	}
	// body, _ := json.Marshal(observation)
	// fmt.Println(string(body))
	if len(observation.Student.School.Users) > 0 {
		return true, nil

	} else {
		return false, nil
	}
	// return true, nil
}
func (o ObservationStore) UpdateObservation(observationId string, shortDesc string, longDesc string, categoryId string) (*Observation, error) {
	// Query the requested observation
	var observation Observation
	if err := o.Model(&observation).
		Where("id=?", observationId).
		Select(); err != nil {
		return nil, err
	}

	// Update the selected observation
	observation.ShortDesc = shortDesc
	observation.LongDesc = longDesc
	observation.CategoryId = categoryId
	if err := o.Update(&observation); err != nil {
		return nil, err
	}
	return &observation, nil
}

func (o ObservationStore) DeleteObservation(observationId string) error {
	observation := Observation{Id: observationId}
	return o.Delete(&observation)
}
