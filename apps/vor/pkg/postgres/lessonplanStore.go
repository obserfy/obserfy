package postgres

import (
	lp "github.com/chrsep/vor/pkg/lessonplan"
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

func (s LessonPlanStore) CreateLessonPlan(planInput lp.PlanData) (*lp.LessonPlan, error) {
	id := uuid.New()
	var rpObj RepetitionPattern

	obj := LessonPlan{
		Id:          id.String(),
		Title:       planInput.Title,
		Description: planInput.Description,
		ClassId:     planInput.ClassId,
		Type:        planInput.Type,
		StartTime:   planInput.StartTime,
	}

	err := s.RunInTransaction(func(tx *pg.Tx) error {
		if err := tx.Insert(&obj); err != nil {
			return err
		}

		for _, file := range planInput.Files {
			if file == "" {
				continue
			}

			objFile := File{
				LessonPlanId: obj.Id,
				Name:         file,
			}

			if err := tx.Insert(&objFile); err != nil {
				return err
			}
		}

		if planInput.EndTime != nil {
			rpObj = RepetitionPattern{
				LessonPlanId: obj.Id,
				EndTime:      *planInput.EndTime,
			}

			if err := tx.Insert(&rpObj); err != nil {
				return err
			}
		}

		return nil
	})

	if err != nil {
		err = errors.Wrapf(err, "failed create lesson plan")
		return nil, err
	}

	return &lp.LessonPlan{
		Id:          obj.Id,
		Title:       obj.Title,
		Description: obj.Description,
		ClassId:     obj.ClassId,
	}, nil
}

func (s LessonPlanStore) UpdateLessonPlan(planData lp.UpdatePlanData) (int, error) {
	// TODO: need to be simplified
	obj := LessonPlan{
		Id: planData.PlanId,
	}

	var rowsAffected int
	err := s.RunInTransaction(func(tx *pg.Tx) error {
		// update lesson plan
		var column []string
		if planData.Title != nil {
			obj.Title = *planData.Title
			column = append(column, "title")
		}
		if planData.Description != nil {
			obj.Description = *planData.Description
			column = append(column, "description")
		}
		if planData.Type != nil {
			obj.Type = *planData.Type
			column = append(column, "type")
		}
		if planData.StartTime != nil {
			obj.StartTime = *planData.StartTime
			column = append(column, "start_time")
		}

		res, err := tx.Model(&obj).Column(column...).WherePK().Update()
		if err != nil {
			return err
		}
		rowsAffected = res.RowsAffected()

		// update lesson plan files
		for _, file := range planData.Files {
			err = tx.Insert(&File{
				LessonPlanId: planData.PlanId,
				Name:         file,
			})
			if err != nil {
				return err
			}
		}

		// delete repetition pattern data if exist
		// if no changes in pattern type, return immediately
		if planData.Type == nil {
			return nil
		}
		if obj.Type == lp.RepetitionNone {
			err := tx.Delete(&RepetitionPattern{LessonPlanId: planData.PlanId})
			if err == pg.ErrNoRows {
				return nil
			}
			return err
		}

		rpObj := RepetitionPattern{
			LessonPlanId: planData.PlanId,
			EndTime:      *planData.EndTime,
		}

		if _, err := tx.Model(&rpObj).OnConflict("(id) DO UPDATE").
			Insert(); err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return rowsAffected, errors.Wrapf(err, "Failed update lesson plan")
	}

	return rowsAffected, nil
}

func (s LessonPlanStore) GetLessonPlan(planId string) (*lp.LessonPlan, error) {
	var obj LessonPlan

	err := s.Model(&obj).
		Where("id = ?", planId).
		Select()

	if err != nil {
		if err == pg.ErrNoRows {
			return nil, nil
		}
		return nil, errors.Wrapf(err, "Failed get lesson plan")
	}

	return &lp.LessonPlan{
		Id:          obj.Id,
		Title:       obj.Title,
		Description: obj.Description,
		ClassId:     obj.ClassId,
		Type:        obj.Type,
		StartTime:   obj.StartTime,
	}, nil
}

func (s LessonPlanStore) DeleteLessonPlan(planId string) error {
	return s.Delete(&LessonPlan{Id: planId})
}

func (s LessonPlanStore) DeleteLessonPlanFile(planId string, files []string) error {
	err := s.RunInTransaction(func(tx *pg.Tx) error {
		for _, file := range files {
			err := tx.Delete(&File{
				LessonPlanId: planId,
				Name:         file,
			})
			if err != nil {
				return err
			}
		}
		return nil
	})

	if err != nil {
		return errors.Wrapf(err, "Failed to delete lesson plan file")
	}

	return nil
}