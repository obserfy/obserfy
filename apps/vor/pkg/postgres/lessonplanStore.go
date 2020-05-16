package postgres

import (
	"github.com/go-pg/pg/v9"
	"github.com/google/uuid"
	"github.com/pkg/errors"
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

func (s LessonPlanStore) CreateLessonPlan(input PlanData) (*LessonPlan, error) {
	id := uuid.New()
	plan := LessonPlan{
		Id:          id.String(),
		Title:       input.Title,
		Description: input.Description,
		ClassId:     input.ClassId,
		Repetition:  input.Repetition,
	}

	if _, err := s.Model(&plan).Insert(); err != nil {
		err = errors.Wrapf(err, "failed create lesson plan")
		return nil, err
	}

	return &plan, nil
}