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

func (s LessonPlanStore) CreateLessonPlan(planInput lp.PlanData, rpInput *lp.RepetitionData) (*lp.LessonPlan, error) {
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

			fileId := uuid.New()
			objFile := File{
				Id:   fileId.String(),
				Name: file,
			}

			if err := tx.Insert(&objFile); err != nil {
				return err
			}

			relation := LessonPlanToFile{
				LessonPlanId: obj.Id,
				FileId:       objFile.Id,
			}

			if err := tx.Insert(&relation); err != nil {
				return err
			}
		}

		if rpInput != nil {
			rpObj = RepetitionPattern{
				LessonPlanId: obj.Id,
				EndTime:      rpInput.EndTime,
				Repetition:   rpInput.Repetition,
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
		if planData.Title != nil {
			obj.Title = *planData.Title
		}
		if planData.Description != nil {
			obj.Description = *planData.Description
		}
		if planData.Type != nil {
			obj.Type = *planData.Type
		}
		if planData.StartTime != nil {
			obj.StartTime = *planData.StartTime
		}

		res, err := tx.Model(&obj).WherePK().Update()
		if err != nil {
			return err
		}
		rowsAffected = res.RowsAffected()

		// delete repetition pattern data if exist
		if obj.Type == lp.TypeNormal {
			err := tx.Delete(&RepetitionPattern{LessonPlanId: planData.PlanId})
			if err != pg.ErrNoRows {
				return err
			}
			return nil
		}

		rpObj := RepetitionPattern{
			LessonPlanId: planData.PlanId,
			EndTime:      *planData.EndTime,
			Repetition:   *planData.Repetition,
		}

		if _, err := tx.Model(&rpObj).OnConflict("(id) DO UPDATE").
			Set("end_time = ?, repetition = ?", rpObj.EndTime, rpObj.Repetition).
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
	}, nil
}