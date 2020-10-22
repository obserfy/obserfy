package postgres

import (
	"github.com/chrsep/vor/pkg/domain"
	"github.com/go-pg/pg/v10"
	"github.com/google/uuid"
	richErrors "github.com/pkg/errors"
	"time"
)

type LessonPlanStore struct {
	*pg.DB
}

func (s LessonPlanStore) AddLinkToLessonPlan(id string, link domain.Link) error {
	lessonPlan := LessonPlan{Id: id}
	if err := s.DB.Model(&lessonPlan).
		WherePK().
		Select(); err != nil {
		return richErrors.Wrap(err, "failed to query the specified lesson plan")
	}

	newLink := LessonPlanLink{
		Id:                  uuid.New(),
		Title:               link.Title,
		Url:                 link.Url,
		Image:               link.Image,
		Description:         link.Description,
		LessonPlanDetailsId: lessonPlan.LessonPlanDetailsId,
	}
	if _, err := s.Model(&newLink).Insert(); err != nil {
		return richErrors.Wrap(err, "failed to insert new link")
	}
	return nil
}

func (s LessonPlanStore) UpdateLessonPlan(Id string,
	Title *string,
	Description *string,
	Date *time.Time,
	_ *domain.RepetitionPattern,
	AreaId *string,
	MaterialId *string,
	ClassId *string,
) (int, error) {
	originalPlan := LessonPlan{Id: Id}
	if err := s.Model(&originalPlan).
		WherePK().
		Column("lesson_plan_details_id").
		Select(); err != nil {
		return 0, richErrors.Wrap(err, "failed to find related plan")
	}

	plan := make(PartialUpdateModel)
	plan.AddDateColumn("date", Date)

	planDetails := make(PartialUpdateModel)
	planDetails.AddStringColumn("description", Description)
	planDetails.AddStringColumn("title", Title)
	planDetails.AddIdColumn("area_id", AreaId)
	planDetails.AddIdColumn("material_id", MaterialId)
	planDetails.AddIdColumn("class_id", ClassId)

	rowsAffected := 0
	if err := s.RunInTransaction(s.Context(), func(tx *pg.Tx) error {
		if !plan.IsEmpty() {
			result, err := tx.Model(plan.GetModel()).
				TableExpr("lesson_plans").
				Where("id = ?", Id).
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

func (s LessonPlanStore) GetLessonPlan(planId string) (*domain.LessonPlan, error) {
	var plan LessonPlan
	err := s.Model(&plan).
		Relation("Students").
		Relation("Students.ProfileImage").
		Relation("LessonPlanDetails").
		Relation("LessonPlanDetails.Links").
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

	result := &domain.LessonPlan{
		Id:          plan.Id,
		ClassId:     plan.LessonPlanDetails.ClassId,
		SchoolId:    plan.LessonPlanDetails.SchoolId,
		Title:       plan.LessonPlanDetails.Title,
		Description: plan.LessonPlanDetails.Description,
		Date:        *plan.Date,
		AreaId:      plan.LessonPlanDetails.AreaId,
		MaterialId:  plan.LessonPlanDetails.MaterialId,
		Repetition: domain.RepetitionPattern{
			Type:    plan.LessonPlanDetails.RepetitionType,
			EndDate: plan.LessonPlanDetails.RepetitionEndDate,
		},
	}
	for _, link := range plan.LessonPlanDetails.Links {
		result.Links = append(result.Links, domain.Link{
			Id:          link.Id,
			Url:         link.Url,
			Image:       link.Image,
			Title:       link.Title,
			Description: link.Description,
		})
	}
	for _, s := range plan.Students {
		result.Students = append(result.Students, domain.Student{
			Id:   s.Id,
			Name: s.Name,
			ProfileImage: domain.Image{
				ObjectKey: s.ProfileImage.ObjectKey,
				Id:        s.ProfileImage.Id,
			},
		})
	}
	return result, nil
}

func (s LessonPlanStore) DeleteLessonPlan(planId string) error {
	_, err := s.Model(&LessonPlan{Id: planId}).WherePK().Delete()
	if err != nil {
		return richErrors.Wrap(err, "failed to delete lesson plan")
	}
	return nil
}

// TODO: Make sure this works
func (s LessonPlanStore) DeleteLessonPlanFile(planId, fileId string) error {
	if _, err := s.Model(&FileToLessonPlan{
		LessonPlanDetailsId: planId,
		FileId:              fileId,
	}).Delete(); err != nil {
		return richErrors.Wrap(err, "failed to delete lesson plan file")
	}
	return nil
}

func (s LessonPlanStore) CheckPermission(userId string, planId string) (bool, error) {
	var user User
	if err := s.Model(&user).
		Relation("Schools").
		Where("id=?", userId).
		Select(); err == pg.ErrNoRows {
		return false, nil
	} else if err != nil {
		return false, richErrors.Wrap(err, "Failed getting user")
	}
	plan, err := s.GetLessonPlan(planId)
	if err != nil {
		return false, richErrors.Wrap(err, "failed to query lesson plan")
	}
	for _, school := range user.Schools {
		if school.Id == plan.SchoolId {
			return true, nil
		}
	}
	return false, nil
}

func (s LessonPlanStore) AddRelatedStudents(planId string, studentIds []uuid.UUID) error {
	relations := make([]LessonPlanToStudents, 0)
	for i := range studentIds {
		relations = append(relations, LessonPlanToStudents{
			LessonPlanId: planId,
			StudentId:    studentIds[i].String(),
		})
	}

	if _, err := s.DB.Model(&relations).Insert(); err != nil {
		return richErrors.Wrap(err, "failed to insert relations")
	}

	return nil
}

func (s LessonPlanStore) DeleteRelatedStudent(planId string, studentId string) error {
	relation := LessonPlanToStudents{
		LessonPlanId: planId,
		StudentId:    studentId,
	}

	if _, err := s.DB.Model(&relation).Where("lesson_plan_id=?lesson_plan_id AND student_id=?student_id").Delete(); err != nil {
		return richErrors.Wrap(err, "failed to delete relations")
	}

	return nil
}
