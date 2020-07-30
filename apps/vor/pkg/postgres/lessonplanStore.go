package postgres

import (
	cLessonPlan "github.com/chrsep/vor/pkg/lessonplan"
	"github.com/go-pg/pg/v10"
	richErrors "github.com/pkg/errors"
)

type (
	LessonPlanStore struct {
		*pg.DB
	}
)

func (s LessonPlanStore) UpdateLessonPlan(planInput cLessonPlan.UpdatePlanData) (int, error) {
	originalPlan := LessonPlan{Id: planInput.Id}
	if err := s.Model(&originalPlan).
		WherePK().
		Column("lesson_plan_details_id").
		Select(); err != nil {
		return 0, richErrors.Wrap(err, "failed to find related plan")
	}

	plan := make(PartialUpdateModel)
	plan.AddDateColumn("date", planInput.Date)

	planDetails := make(PartialUpdateModel)
	planDetails.AddStringColumn("description", planInput.Description)
	planDetails.AddStringColumn("title", planInput.Title)
	planDetails.AddIdColumn("area_id", planInput.AreaId)
	planDetails.AddIdColumn("material_id", planInput.MaterialId)
	planDetails.AddIdColumn("class_id", planInput.ClassId)

	rowsAffected := 0
	if err := s.RunInTransaction(func(tx *pg.Tx) error {
		if !plan.IsEmpty() {
			result, err := tx.Model(plan.GetModel()).
				TableExpr("lesson_plans").
				Where("id = ?", planInput.Id).
				Update()
			if err != nil {
				return richErrors.Wrap(err, "")
			}
			rowsAffected = rowsAffected + result.RowsAffected()
		}

		// Make sure that we're aren't doing an update with empty struct
		if !planDetails.IsEmpty() {
			result, err := tx.Model(planDetails.GetModel()).
				TableExpr("lesson_plan_details").
				Where("id=?", originalPlan.LessonPlanDetailsId).
				Update()
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
		//Relation("Users").
		//Where("user.id = ?",plan.LessonPlanDetails.UserId).
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
		Description: plan.LessonPlanDetails.Description,
		Date:        *plan.Date,
		AreaId:      plan.LessonPlanDetails.AreaId,
		MaterialId:  plan.LessonPlanDetails.MaterialId,
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
