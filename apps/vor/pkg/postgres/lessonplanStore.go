package postgres

import (
	"github.com/go-pg/pg/v9"
	"github.com/google/uuid"
	"github.com/pkg/errors"

	lp "github.com/chrsep/vor/pkg/lessonplan"
)

type (
	LessonPlanStore struct {
		*pg.DB
	}

	PlanData struct {
		ClassId     string
		Title       string
		Description string
		Repetition  int
	}
)

func (s LessonPlanStore) CreateLessonPlan(input lp.PlanData) (*lp.LessonPlan, error) {
	id := uuid.New()
	obj := LessonPlan{
		Id:          id.String(),
		Title:       input.Title,
		Description: input.Description,
		ClassId:     input.ClassId,
		Repetition:  input.Repetition,
	}

	if _, err := s.Model(&obj).Insert(); err != nil {
		err = errors.Wrapf(err, "failed create lesson plan")
		return nil, err
	}

	return &lp.LessonPlan{
		Id:          obj.Id,
		Title:       obj.Title,
		Description: obj.Description,
		ClassId:     obj.ClassId,
		Repetition:  obj.Repetition,
	}, nil
}

func (s LessonPlanStore) GetLessonPlan(planId string) (*lp.LessonPlan, error) {
	var obj LessonPlan

	err := s.Model(&obj).
			Where("id = ?", planId).
			Select()

	if err != nil {
		if err == pg.ErrNoRows{
			return nil, nil
		}
		return nil, errors.Wrapf(err, "Failed get lesson plan")
	}

	return &lp.LessonPlan{
		Id:          obj.Id,
		Title:       obj.Title,
		Description: obj.Description,
		ClassId:     obj.ClassId,
		Repetition:  obj.Repetition,
	}, nil
}