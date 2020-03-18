package postgres

import (
	"github.com/chrsep/vor/pkg/class"
	"github.com/go-pg/pg/v9"
	richErrors "github.com/pkg/errors"
	"time"
)

type ClassStore struct {
	DB *pg.DB
}

func (s ClassStore) UpdateClass(id string, name string, weekdays []time.Weekday, startTime time.Time, endTime time.Time) (int, error) {
	dbWeekdays := make([]Weekday, len(weekdays))
	for i, weekday := range weekdays {
		dbWeekdays[i] = Weekday{
			ClassId: id,
			Day:     weekday,
		}
	}
	target := Class{
		Id:        id,
		Name:      name,
		StartTime: startTime,
		EndTime:   endTime,
	}
	var rowsEffected int
	if err := s.DB.RunInTransaction(func(tx *pg.Tx) error {
		result, err := s.DB.
			Model(&target).
			Where("id=?id").
			UpdateNotZero()
		if err != nil {
			return richErrors.Wrap(err, "failed updating class")
		}
		rowsEffected = result.RowsAffected()
		if weekdays != nil {
			// Completely replace the weekdays with the new ones.
			if _, err := s.DB.
				Model((*Weekday)(nil)).
				Where("class_id=? AND day NOT IN (?)", id, pg.In(weekdays)).
				Delete(); err != nil {
				return richErrors.Wrap(err, "failed deleting old not used weekdays")
			}
			if _, err := s.DB.
				Model(&dbWeekdays).
				OnConflict("DO NOTHING").
				Insert(); err != nil {
				return richErrors.Wrap(err, "failed inserting new weekdays")
			}
		}
		return nil
	}); err != nil {
		return 0, err
	}
	return rowsEffected, nil
}

func (s ClassStore) GetClass(id string) (*class.Class, error) {
	var target Class
	if err := s.DB.Model(&target).
		Relation("Weekdays").
		Where("id=?", id).
		Select(); err == pg.ErrNoRows {
		return nil, nil
	} else if err != nil {
		return nil, richErrors.Wrap(err, "failed querying class")
	}

	days := make([]time.Weekday, len(target.Weekdays))
	for i, weekday := range target.Weekdays {
		days[i] = weekday.Day
	}
	return &class.Class{
		Id:        target.Id,
		Name:      target.Name,
		Weekdays:  days,
		StartTime: target.StartTime,
		EndTime:   target.EndTime,
	}, nil
}

func (s ClassStore) DeleteClass(id string) (int, error) {
	result, err := s.DB.Model((*Class)(nil)).
		Where("id=?", id).
		Delete()
	if err == pg.ErrNoRows {
		return 0, nil
	} else if err != nil {
		return 0, richErrors.Wrap(err, "failed deleting class")
	}
	return result.RowsAffected(), nil
}
