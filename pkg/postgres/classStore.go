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
