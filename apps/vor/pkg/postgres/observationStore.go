package postgres

import (
	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
	richErrors "github.com/pkg/errors"

	cObservation "github.com/chrsep/vor/pkg/observation"
)

type ObservationStore struct {
	*pg.DB
}

func (s ObservationStore) GetObservation(id string) (*cObservation.Observation, error) {
	var observation Observation
	if err := s.Model(&observation).
		Where("Observation.id=?", id).
		Relation("Creator").
		Relation("Student").
		Select(); err == pg.ErrNoRows {
		return nil, nil
	} else if err != nil {
		return nil, richErrors.Wrap(err, "failed getting observation")
	}

	return &cObservation.Observation{
		Id:          observation.Id,
		StudentName: observation.Student.Name,
		CategoryId:  observation.CategoryId,
		LongDesc:    observation.LongDesc,
		ShortDesc:   observation.ShortDesc,
		EventTime:   observation.EventTime,
		CreatedDate: observation.CreatedDate,
		CreatorId:   observation.CreatorId,
		CreatorName: observation.Creator.Name,
	}, nil
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
		return false, richErrors.Wrap(err, "failed checking user access to observation")
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

func (s ObservationStore) UpdateObservation(observationId string, shortDesc string, longDesc string, categoryId string) (*cObservation.Observation, error) {
	// Query the requested observation
	var observation Observation
	if err := s.Model(&observation).
		Where("id=?", observationId).
		Select(); err != nil {
		return nil, err
	}

	// Update the selected observation
	observation.ShortDesc = shortDesc
	observation.LongDesc = longDesc
	observation.CategoryId = categoryId
	if err := s.Update(&observation); err != nil {
		return nil, err
	}

	return &cObservation.Observation{
		Id:          observation.Id,
		StudentId:   observation.StudentId,
		ShortDesc:   shortDesc,
		LongDesc:    longDesc,
		CategoryId:  categoryId,
		CreatedDate: observation.CreatedDate,
		EventTime:   observation.EventTime,
		CreatorId:   observation.CreatorId,
	}, nil
}

func (s ObservationStore) DeleteObservation(observationId string) error {
	observation := Observation{Id: observationId}
	return s.Delete(&observation)
}
