package postgres

import (
	"github.com/chrsep/vor/pkg/class"
	"time"

	"github.com/go-pg/pg/v10"
	richErrors "github.com/pkg/errors"
)

type ClassStore struct {
	DB *pg.DB
}

func (s ClassStore) CheckPermission(userId string, classId string) (bool, error) {
	var target Class
	if err := s.DB.Model(&target).
		Relation("School").
		Relation("Users").
		Where("id=?", classId).
		Where("user.id=?", userId).
		Select(); err == pg.ErrNoRows {
		return false, nil
	} else if err != nil {
		return false, richErrors.Wrap(err, "failed getting user and class relationship")
	}
	return true, nil
}

func (s ClassStore) GetClassSession(classId string) ([]class.ClassSession, error) {

	var attendance []Attendance
	var session []class.ClassSession
	if err := s.DB.Model(&attendance).
		Distinct().
		ColumnExpr("cast(date AS date)").
		Select(); err != nil {
		return nil, err
	}
	if len(attendance) > 0 {
		for _, attendance := range attendance {
			session = append(session, class.ClassSession{
				Date: attendance.Date.Format("2006-01-02"),
			})
		}
	}
	var selectedClass Class
	if err := s.DB.Model(&selectedClass).
		Relation("Weekdays").
		Where("id=?", classId).
		Select(); err != nil {
		return nil, err
	}
	for _, weekday := range selectedClass.Weekdays {
		if int(time.Weekday(weekday.Day)-time.Now().Weekday()) < 0 {
			session = append(session, class.ClassSession{
				Date: time.Now().AddDate(0, 0, 7+int(time.Weekday(weekday.Day)-time.Now().Weekday())).Format("2006-01-02"),
			})
		} else if int(time.Weekday(weekday.Day)-time.Now().Weekday()) > 0 {
			session = append(session, class.ClassSession{
				Date: time.Now().AddDate(0, 0, int(time.Now().Weekday())+int(time.Weekday(weekday.Day)-time.Now().Weekday())).Format("2006-01-02"),
			})
		} else {
			session = append(session, class.ClassSession{
				Date: time.Now().AddDate(0, 0, int(time.Weekday(weekday.Day))).Format("2006-01-02"),
			})
		}
	}
	return session, nil
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
			if len(weekdays) > 0 {
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
			} else {
				if _, err := s.DB.
					Model((*Weekday)(nil)).
					Where("class_id=?", id).
					Delete(); err != nil {
					return richErrors.Wrap(err, "failed deleting old not used weekdays")
				}
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
		Relation("Students").
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
	students := make([]class.Student, len(target.Students))
	for i, student := range target.Students {
		students[i] = class.Student{Id: student.Id, Name: student.Name}
	}
	return &class.Class{
		Id:        target.Id,
		Name:      target.Name,
		Weekdays:  days,
		StartTime: target.StartTime,
		EndTime:   target.EndTime,
		Students:  students,
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
