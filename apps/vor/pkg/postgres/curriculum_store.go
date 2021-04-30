package postgres

import (
	"github.com/chrsep/vor/pkg/domain"
	"github.com/go-pg/pg/v10"
	"github.com/google/uuid"
	richErrors "github.com/pkg/errors"
)

type CurriculumStore struct {
	*pg.DB
}

func (s CurriculumStore) DeleteMaterial(id string) error {
	material := Material{Id: id}
	if _, err := s.Model(&material).WherePK().Delete(); err != nil {
		return richErrors.Wrap(err, "failed to delete material")
	}
	return nil
}

func (s CurriculumStore) UpdateSubject(id string, name *string, order *int, description *string, areaId *uuid.UUID) (*domain.Subject, error) {

	subject := Subject{Id: id}
	if err := s.Model(&subject).
		WherePK().
		Select(); err != nil {
		return nil, richErrors.Wrap(err, "failed to find subject")
	}

	if err := s.RunInTransaction(s.Context(), func(tx *pg.Tx) error {
		// Reorder the order of materials
		if order != nil {
			var err error
			if *order <= subject.Order {
				_, err = tx.Model((*Subject)(nil)).
					Set(`"order" = "order" + 1`).
					Where(`area_id=? AND "order" >= ? AND "order" < ? AND id != ?`, subject.AreaId, order, subject.Order, subject.Id).
					Update()
			} else {
				_, err = tx.Model((*Subject)(nil)).
					Set(`"order" = "order" - 1`).
					Where(`area_id=? AND "order" <= ? AND "order" > ? AND id != ?`, subject.AreaId, order, subject.Order, subject.Id).
					Update()
			}
			if err != nil {
				return err
			}
			subject.Order = *order
		}

		updateQuery := make(PartialUpdateModel)
		updateQuery.AddStringColumn("name", name)
		updateQuery.AddStringColumn("description", description)
		updateQuery.AddUUIDColumn("area_id", areaId)
		updateQuery.AddIntColumn("order", order)

		// Update the targeted materials with the targeted changes
		if _, err := tx.Model(updateQuery.GetModel()).
			TableExpr("subjects").
			Where("id = ?", id).
			Update(); err != nil {
			return err
		}
		return nil
	}); err != nil {
		return nil, err
	}

	subject = Subject{Id: id}
	if err := s.Model(&subject).
		WherePK().
		Select(); err != nil {
		return nil, richErrors.Wrap(err, "failed to find subject")
	}
	return &domain.Subject{
		Id:          subject.Id,
		AreaId:      subject.AreaId,
		Name:        subject.Name,
		Order:       subject.Order,
		Description: subject.Description,
	}, nil
}

func (s CurriculumStore) UpdateCurriculum(curriculumId string, name *string, description *string) (*domain.Curriculum, error) {
	updateQuery := make(PartialUpdateModel)
	updateQuery.AddStringColumn("name", name)
	updateQuery.AddStringColumn("description", description)

	if _, err := s.Model(updateQuery.GetModel()).
		TableExpr("curriculums").
		Where("id = ?", curriculumId).
		Update(); err != nil {
		return nil, err
	}

	curriculum := Curriculum{Id: curriculumId}
	if err := s.Model(&curriculum).
		WherePK().
		Select(); err != nil {
		return nil, err
	}

	return &domain.Curriculum{
		Id:          curriculum.Id,
		Name:        curriculum.Name,
		Description: curriculum.Name,
	}, nil
}

func (s CurriculumStore) CheckMaterialPermission(materialId string, userId string) (bool, error) {
	var material Material
	var user User
	if err := s.Model(&material).
		Relation("Subject").
		Relation("Subject.Area").
		Relation("Subject.Area.Curriculum").
		Where("material.id=?", materialId).
		Select(); err == pg.ErrNoRows {
		return false, nil
	} else if err != nil {
		return false, richErrors.Wrap(err, "Failed getting subject")
	}
	if err := s.Model(&user).
		Relation("Schools").
		Where("id=?", userId).
		Select(); err == pg.ErrNoRows {
		return false, nil
	} else if err != nil {
		return false, richErrors.Wrap(err, "Failed getting user")
	}
	for _, school := range user.Schools {
		if material.Subject.Area.CurriculumId == school.CurriculumId {
			return true, nil
		}
	}

	return false, nil
}

func (s CurriculumStore) CheckCurriculumPermission(curriculumId string, userId string) (bool, error) {
	var c Curriculum
	var user User
	if err := s.Model(&c).
		Where("id=?", curriculumId).
		Select(); err == pg.ErrNoRows {
		return false, nil
	} else if err != nil {
		return false, richErrors.Wrap(err, "Failed getting subject")
	}
	if err := s.Model(&user).
		Relation("Schools").
		Where("id=?", userId).
		Select(); err == pg.ErrNoRows {
		return false, nil
	} else if err != nil {
		return false, richErrors.Wrap(err, "Failed getting user")
	}
	for _, school := range user.Schools {
		if c.Id == school.CurriculumId {
			return true, nil
		}
	}

	return false, nil
}

func (s CurriculumStore) UpdateArea(areaId string, name string) error {
	area := Area{Id: areaId, Name: name}
	if _, err := s.DB.Model(&area).
		Column("name").
		Where("id=?", areaId).
		Update(); err != nil {
		return richErrors.Wrap(err, "Failed updating area")
	}
	return nil
}

// updateSubject manually replace existing data with new ones completely. Without destroying its relationship with
// existing data.
func (s CurriculumStore) CheckSubjectPermissions(subjectId string, userId string) (bool, error) {
	var subject Subject
	var user User
	if err := s.Model(&subject).
		Relation("Area").
		Relation("Area.Curriculum").
		Where("subject.id=?", subjectId).
		Select(); err == pg.ErrNoRows {
		return false, nil
	} else if err != nil {
		return false, richErrors.Wrap(err, "Failed getting subject")
	}
	if err := s.Model(&user).
		Relation("Schools").
		Where("id=?", userId).
		Select(); err == pg.ErrNoRows {
		return false, nil
	} else if err != nil {
		return false, richErrors.Wrap(err, "Failed getting user")
	}
	for _, school := range user.Schools {
		if subject.Area.CurriculumId == school.CurriculumId {
			return true, nil
		}
	}

	return false, nil
}
func (s CurriculumStore) CheckAreaPermissions(areaId string, userId string) (bool, error) {
	var area Area
	var user User
	if err := s.Model(&area).
		Relation("Curriculum").
		Where("area.id=?", areaId).
		Select(); err == pg.ErrNoRows {
		return false, nil
	} else if err != nil {
		return false, richErrors.Wrap(err, "Failed getting area")
	}
	if err := s.Model(&user).
		Relation("Schools").
		Where("id=?", userId).
		Select(); err == pg.ErrNoRows {
		return false, nil
	} else if err != nil {
		return false, richErrors.Wrap(err, "Failed getting user")
	}
	for _, school := range user.Schools {
		if area.CurriculumId == school.CurriculumId {
			return true, nil
		}
	}

	return false, nil
}

func (s CurriculumStore) ReplaceSubject(newSubject domain.Subject) error {
	var materialsToKeep []string
	for _, material := range newSubject.Materials {
		materialsToKeep = append(materialsToKeep, material.Id)
	}
	if err := s.DB.RunInTransaction(s.DB.Context(), func(tx *pg.Tx) error {
		if _, err := tx.Model(&newSubject).WherePK().Update(); err != nil {
			return richErrors.Wrap(err, "Failed updating subject")
		}
		if len(materialsToKeep) > 0 {
			if _, err := tx.Model(&newSubject.Materials).
				OnConflict("(id) DO UPDATE").
				Insert(); err != nil {
				return richErrors.Wrap(err, "Failed updating materials")
			}
			if _, err := tx.Model((*Material)(nil)).
				Where("subject_id=? AND id NOT IN (?)", newSubject.Id, pg.In(materialsToKeep)).
				Delete(); err != nil {
				return richErrors.Wrap(err, "Failed deleting removed materials")
			}
		} else {
			if _, err := tx.Model((*Material)(nil)).
				Where("subject_id=?", newSubject.Id).
				Delete(); err != nil {
				return richErrors.Wrap(err, "Failed deleting removed materials")
			}
		}
		return nil
	}); err != nil {
		return err
	}
	return nil
}

func (s CurriculumStore) GetMaterial(materialId string) (*domain.Material, error) {
	var material Material
	if err := s.DB.Model(&material).
		Where("id=?", materialId).
		Select(); err != nil {
		return nil, err
	}

	return &domain.Material{
		Id:          material.Id,
		SubjectId:   material.SubjectId,
		Name:        material.Name,
		Order:       material.Order,
		Description: material.Description,
	}, nil
}

func (s CurriculumStore) UpdateMaterial(id string, name *string, order *int, description *string, subjectId *uuid.UUID) error {
	material := Material{Id: id}
	if err := s.Model(&material).
		WherePK().
		Select(); err != nil {
		return richErrors.Wrap(err, "failed to find material")
	}

	if err := s.RunInTransaction(s.Context(), func(tx *pg.Tx) error {
		// Reorder the order of materials
		if order != nil {
			var err error
			if *order <= material.Order {
				_, err = tx.Model((*Material)(nil)).
					Set(`"order" = "order" + 1`).
					Where(`subject_id=? AND "order" >= ? AND "order" < ? AND id != ?`, material.SubjectId, order, material.Order, material.Id).
					Update()
			} else {
				_, err = tx.Model((*Material)(nil)).
					Set(`"order" = "order" - 1`).
					Where(`subject_id=? AND "order" <= ? AND "order" > ? AND id != ?`, material.SubjectId, order, material.Order, material.Id).
					Update()
			}
			if err != nil {
				return err
			}
			material.Order = *order
		}

		updateQuery := PartialUpdateModel{}
		updateQuery.AddStringColumn("name", name)
		updateQuery.AddUUIDColumn("subject_id", subjectId)
		updateQuery.AddStringColumn("description", description)
		updateQuery.AddIntColumn("order", order)

		// Update the targeted materials with the targeted changes
		if _, err := tx.Model(updateQuery.GetModel()).
			TableExpr("materials").
			Where("id = ?", id).
			Update(); err != nil {
			return err
		}
		return nil
	}); err != nil {
		return err
	}
	return nil
}

func (s CurriculumStore) NewMaterial(subjectId string, name string, description string) (*domain.Material, error) {
	var biggestOrder int
	if _, err := s.DB.Model((*Material)(nil)).
		Where("subject_id=?", subjectId).
		QueryOne(
			pg.Scan(&biggestOrder), `
				SELECT MAX("order") FROM ?TableName
				WHERE subject_id=?
			`,
			subjectId,
		); err != nil {
		return nil, err
	}

	material := Material{
		Id:          uuid.New().String(),
		SubjectId:   subjectId,
		Name:        name,
		Order:       biggestOrder + 1,
		Description: description,
	}
	if _, err := s.DB.Model(&material).Insert(); err != nil {
		return nil, err
	}

	return &domain.Material{
		Id:          material.Id,
		SubjectId:   material.SubjectId,
		Name:        material.Name,
		Order:       material.Order,
		Description: material.Description,
	}, nil
}

func (s CurriculumStore) GetSubject(id string) (*domain.Subject, error) {
	var subject Subject
	if err := s.DB.Model(&subject).
		Where("id=?", id).
		Select(); err != nil {
		return nil, err
	}

	return &domain.Subject{
		Id:     subject.Id,
		AreaId: subject.AreaId,
		Name:   subject.Name,
		Order:  subject.Order,
	}, nil
}

func (s CurriculumStore) NewSubject(name string, areaId string, materials []domain.Material, description string) (*domain.Subject, error) {
	var biggestOrder int
	if _, err := s.DB.Model((*Subject)(nil)).
		Where("area_id=?", areaId).
		QueryOne(pg.Scan(&biggestOrder), `
		SELECT MAX("order") FROM ?TableName
		WHERE area_id=?
	`, areaId); err != nil {
		return nil, err
	}

	subject := Subject{
		Id:          uuid.New().String(),
		AreaId:      areaId,
		Name:        name,
		Order:       biggestOrder + 1,
		Description: description,
	}
	for i := range materials {
		materials[i].SubjectId = subject.Id
	}
	if err := s.DB.RunInTransaction(s.DB.Context(), func(tx *pg.Tx) error {
		if _, err := tx.Model(&subject).Insert(); err != nil {
			return err
		}
		if len(materials) != 0 {
			if _, err := tx.Model(&materials).Insert(); err != nil {
				return err
			}
		}
		return nil
	}); err != nil {
		return nil, err
	}

	return &domain.Subject{
		Id:          subject.Id,
		AreaId:      subject.AreaId,
		Name:        subject.Name,
		Order:       subject.Order,
		Description: subject.Description,
	}, nil
}

func (s CurriculumStore) NewArea(curriculumId string, name string, description string) (*domain.Area, error) {
	id := uuid.New().String()
	area := Area{
		Id:           id,
		CurriculumId: curriculumId,
		Name:         name,
		Description:  description,
	}
	if _, err := s.Model(&area).Insert(); err != nil {
		return nil, err
	}
	return &domain.Area{
		Id:          area.Id,
		Name:        area.Name,
		Description: area.Description,
	}, nil
}

func (s CurriculumStore) GetArea(areaId string) (*domain.Area, error) {
	var area Area
	if err := s.Model(&area).
		Where("id=?", areaId).
		Select(); err != nil {
		return nil, err
	}

	return &domain.Area{
		Id:          area.Id,
		Name:        area.Name,
		Description: area.Description,
	}, nil
}

func (s CurriculumStore) GetAreaSubjects(areaId string) ([]domain.Subject, error) {
	var subjects []Subject
	res := make([]domain.Subject, 0)

	if err := s.Model(&subjects).
		Where("area_id=?", areaId).
		Order("order").
		Select(); err != nil {
		return nil, err
	}

	for _, v := range subjects {
		res = append(res, domain.Subject{
			Id:          v.Id,
			Name:        v.Name,
			Order:       v.Order,
			Description: v.Description,
		})
	}

	return res, nil
}

func (s CurriculumStore) GetSubjectMaterials(subjectId string) ([]domain.Material, error) {
	var materials []Material
	if err := s.Model(&materials).
		Where("subject_id=?", subjectId).
		Order("order").
		Select(); err != nil {
		return nil, err
	}

	result := make([]domain.Material, 0)
	for _, m := range materials {
		result = append(result, domain.Material{
			Id:          m.Id,
			Name:        m.Name,
			Order:       m.Order,
			Description: m.Description,
		})
	}
	return result, nil
}

func (s CurriculumStore) DeleteArea(id string) error {
	area := Area{Id: id}
	if _, err := s.DB.Model(&area).WherePK().Delete(); err != nil {
		return err
	}
	return nil
}

func (s CurriculumStore) DeleteSubject(id string) error {
	subject := Subject{Id: id}
	if _, err := s.DB.Model(&subject).WherePK().Delete(); err != nil {
		return err
	}
	return nil
}
