package postgres

import (
	cLessonPlan "github.com/chrsep/vor/pkg/lessonplan"
	"github.com/go-pg/pg/v9"
	"github.com/google/uuid"
	richErrors "github.com/pkg/errors"
)

type (
	LessonPlanStore struct {
		*pg.DB
	}
)

func (s LessonPlanStore) CreateLessonPlan(planInput cLessonPlan.PlanData) (*cLessonPlan.LessonPlan, error) {
	planDetails := LessonPlanDetails{
		Id:          uuid.New().String(),
		ClassId:     planInput.ClassId,
		Title:       planInput.Title,
		Description: &planInput.Description,
		AreaId:      planInput.AreaId,
	}

	if planInput.MaterialId != "" {
		relatedMaterial := Material{Id: planInput.MaterialId}
		if err := s.Model(&relatedMaterial).
			WherePK().
			Relation("Subject.area_id").
			Select(); err != nil {
			return nil, richErrors.Wrap(err, "failed to get related material's area_id")
		}
		planDetails.MaterialId = planInput.MaterialId
		planDetails.AreaId = relatedMaterial.Subject.AreaId
	}

	var plans []LessonPlan
	plans = append(plans, LessonPlan{
		Id:                  uuid.New().String(),
		Date:                &planInput.Date,
		LessonPlanDetailsId: planDetails.Id,
	})
	// Create all instance of repeating plans and save to db. This will make it easy to
	// retrieve, modify, and attach metadata to individual instances of the plans down the road
	if planInput.Repetition != nil && planInput.Repetition.Type != cLessonPlan.RepetitionNone {
		// If nil, repetition_type column in db will automatically be 0, since it has useZero tag.
		planDetails.RepetitionType = planInput.Repetition.Type
		planDetails.RepetitionEndDate = planInput.Repetition.EndDate

		currentDate := planInput.Date
		monthToAdd := 0
		daysToAdd := 0
		switch planInput.Repetition.Type {
		case cLessonPlan.RepetitionDaily:
			daysToAdd = 1
		case cLessonPlan.RepetitionWeekly:
			daysToAdd = 7
		case cLessonPlan.RepetitionMonthly:
			monthToAdd = 1
		}
		for {
			currentDate = currentDate.AddDate(0, monthToAdd, daysToAdd)
			if currentDate.After(planInput.Repetition.EndDate) {
				break
			}
			plans = append(plans, LessonPlan{
				Id:                  uuid.New().String(),
				Date:                &currentDate,
				LessonPlanDetailsId: planDetails.Id,
			})
		}
	}

	fileRelations := make([]FileToLessonPlan, len(planInput.FileIds))
	for idx, file := range planInput.FileIds {
		fileRelations[idx] = FileToLessonPlan{
			LessonPlanDetailsId: planDetails.Id,
			FileId:              file,
		}
	}

	if err := s.RunInTransaction(func(tx *pg.Tx) error {
		if err := tx.Insert(&planDetails); err != nil {
			return richErrors.Wrap(err, "failed to save lesson plan details")
		}
		if err := tx.Insert(&plans); err != nil {
			return richErrors.Wrap(err, "failed to save lesson plan")
		}
		if len(fileRelations) > 0 {
			if err := tx.Insert(&fileRelations); err != nil {
				return richErrors.Wrap(err, "failed to save file relations")
			}
		}
		return nil
	}); err != nil {

		return nil, err
	}

	return &cLessonPlan.LessonPlan{
		Id:          planDetails.Id,
		Title:       planDetails.Title,
		Description: *planDetails.Description,
		ClassId:     planDetails.ClassId,
	}, nil
}

func (s LessonPlanStore) UpdateLessonPlan(planInput cLessonPlan.UpdatePlanData) (int, error) {
	originalPlan := LessonPlan{Id: planInput.Id}
	if err := s.Model(&originalPlan).
		WherePK().
		Column("lesson_plan_details_id").
		Select(); err != nil {
		return 0, richErrors.Wrap(err, "failed to find related plan")
	}
	plan := LessonPlan{
		Id:   planInput.Id,
		Date: planInput.Date,
	}
	planDetails := LessonPlanDetails{
		Id:          originalPlan.LessonPlanDetailsId,
		Description: planInput.Description,
	}
	if planInput.Title != nil {
		planDetails.Title = *planInput.Title
	}

	rowsAffected := 0
	if err := s.RunInTransaction(func(tx *pg.Tx) error {
		if planInput.Date != nil {
			result, err := tx.Model(&plan).WherePK().UpdateNotZero()
			if err != nil {
				return richErrors.Wrap(err, "")
			}
			rowsAffected = rowsAffected + result.RowsAffected()
		}

		if planInput.Title != nil || planInput.Description != nil {
			result, err := tx.Model(&planDetails).WherePK().UpdateNotZero()
			if err != nil {
				return richErrors.Wrap(err, "")
			}
			rowsAffected = rowsAffected + result.RowsAffected()
		}
		return nil
	}); err != nil {
		return rowsAffected, richErrors.Wrap(err, "Failed update lesson plan")
	}

	return rowsAffected, nil
}

func (s LessonPlanStore) GetLessonPlan(planId string) (*cLessonPlan.LessonPlan, error) {
	var plan LessonPlan

	err := s.Model(&plan).
		Relation("LessonPlanDetails").
		Where("lesson_plan.id = ?", planId).
		Select()

	if err != nil {
		if err == pg.ErrNoRows {
			return nil, nil
		}
		return nil, richErrors.Wrapf(err, "Failed get lesson plan")
	}

	return &cLessonPlan.LessonPlan{
		Id:          plan.Id,
		ClassId:     plan.LessonPlanDetails.ClassId,
		Title:       plan.LessonPlanDetails.Title,
		Description: *plan.LessonPlanDetails.Description,
		Date:        *plan.Date,
		Repetition: &cLessonPlan.RepetitionPattern{
			Type:    plan.LessonPlanDetails.RepetitionType,
			EndDate: plan.LessonPlanDetails.RepetitionEndDate,
		},
	}, nil
}

func (s LessonPlanStore) DeleteLessonPlan(planId string) error {
	return s.Delete(&LessonPlan{Id: planId})
}

func (s LessonPlanStore) DeleteLessonPlanFile(planId, fileId string) error {
	return s.Delete(&FileToLessonPlan{
		LessonPlanDetailsId: planId,
		FileId:              fileId,
	})
}
