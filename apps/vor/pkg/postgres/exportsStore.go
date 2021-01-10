package postgres

import (
	"github.com/chrsep/vor/pkg/domain"
	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
	"github.com/google/uuid"
	richErrors "github.com/pkg/errors"
	"strings"
)

type ExportsStore struct {
	*pg.DB
}

func (s ExportsStore) GetObservations(schoolId string, studentId string, search string, startDate string, endDate string) ([]domain.Observation, error) {
	var observations []Observation
	query := s.Model(&observations).
		Relation("Student").
		Relation("Creator").
		Relation("Area").
		Relation("Images").
		Order("created_date").
		Where("student.school_id=?", schoolId).
		Where("student_id=?", studentId)

	if startDate != "" {
		query = query.Where("event_time >= ?", startDate)
	}
	if endDate != "" {
		query = query.Where("event_time <= ?", endDate)
	}
	if search != "" {
		query = query.Where("to_tsvector(coalesce(long_desc, '') || ' ' || short_desc) @@ to_tsquery(?)", strings.ReplaceAll(search, " ", " & ")+":*")
	}

	if err := query.Select(); err != nil {
		return nil, err
	}

	result := make([]domain.Observation, 0)
	for _, observation := range observations {
		newObservation := domain.Observation{
			Id:                 observation.Id,
			StudentId:          observation.StudentId,
			StudentName:        observation.Student.Name,
			ShortDesc:          observation.ShortDesc,
			LongDesc:           observation.LongDesc,
			CategoryId:         observation.CategoryId,
			CreatedDate:        observation.CreatedDate,
			EventTime:          observation.EventTime,
			VisibleToGuardians: observation.VisibleToGuardians,
		}

		if observation.CreatorId != "" {
			newObservation.CreatorId = observation.Creator.Id
			newObservation.CreatorName = observation.Creator.Name
		}

		if observation.AreaId != uuid.Nil {
			newObservation.Area = domain.Area{
				Id:   observation.Area.Id,
				Name: observation.Area.Name,
			}
		}

		result = append(result, newObservation)
	}
	return result, nil
}

func (s ExportsStore) CheckPermissions(schoolId string, userId string) (bool, error) {
	var school School
	if err := s.Model(&school).
		Relation("Student.School.Users", func(q *orm.Query) (*orm.Query, error) {
			return q.Where("user_id = ?", userId), nil
		}).
		Where("school.id=?", schoolId).
		Select(); err == pg.ErrNoRows {
		return false, nil
	} else if err != nil {
		return false, richErrors.Wrap(err, "failed checking user access to observation")
	}
	if len(school.Users) > 0 {
		return true, nil

	} else {
		return false, nil
	}
}
