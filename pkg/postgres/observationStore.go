package postgres

import (
	"github.com/go-pg/pg/v9"
)

type ObservationStore struct {
	*pg.DB
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
