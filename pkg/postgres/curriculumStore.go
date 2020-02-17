package postgres

import (
	"github.com/go-pg/pg/v9"
	"github.com/google/uuid"
	richErrors "github.com/pkg/errors"
)

type CurriculumStore struct {
	*pg.DB
}

func (c CurriculumStore) UpdateArea(areaId string, name string) error {
	area := Area{Id: areaId, Name: name}
	if _, err := c.DB.Model(&area).
		Column("name").
		Where("id=?", areaId).
		Update(); err != nil {
		return richErrors.Wrap(err, "Failed updating area")
	}
	return nil
}

func (c CurriculumStore) ReplaceSubject(newSubject Subject) error {
	var materialsToKeep []string
	for _, material := range newSubject.Materials {
		materialsToKeep = append(materialsToKeep, material.Id)
	}
	if err := c.DB.RunInTransaction(func(tx *pg.Tx) error {
		if err := tx.Update(&newSubject); err != nil {
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

func (c CurriculumStore) GetMaterial(materialId string) (*Material, error) {
	var material Material
	if err := c.DB.Model(&material).
		Where("id=?", materialId).
		Select(); err != nil {
		return nil, err
	}
	return &material, nil
}

func (c CurriculumStore) UpdateMaterial(material *Material, order *int) error {
	if err := c.RunInTransaction(func(tx *pg.Tx) error {
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

		// Update the targeted materials with the targeted changes
		if err := tx.Update(material); err != nil {
			return err
		}
		return nil
	}); err != nil {
		return err
	}
	return nil
}

func (c CurriculumStore) NewMaterial(name string, subjectId string) (*Material, error) {
	var biggestOrder int
	if _, err := c.DB.Model((*Material)(nil)).
		Where("subject_id=?", subjectId).
		QueryOne(pg.Scan(&biggestOrder), `
		SELECT MAX("order") FROM ?TableName
		WHERE subject_id=?
	`, subjectId); err != nil {
		return nil, err
	}

	material := Material{
		Id:        uuid.New().String(),
		SubjectId: subjectId,
		Name:      name,
		Order:     biggestOrder + 1,
	}
	if err := c.DB.Insert(&material); err != nil {
		return nil, err
	}
	return &material, nil
}

func (c CurriculumStore) UpdateSubject(subject *Subject) error {
	if err := c.DB.Update(subject); err != nil {
		return err
	}
	return nil
}

func (c CurriculumStore) GetSubject(id string) (*Subject, error) {
	var subject Subject
	if err := c.DB.Model(&subject).
		Where("id=?", id).
		Select(); err != nil {
		return nil, err
	}
	return &subject, nil
}

func (c CurriculumStore) NewSubject(name string, areaId string, materials []Material) (*Subject, error) {
	var biggestOrder int
	if _, err := c.DB.Model((*Subject)(nil)).
		Where("area_id=?", areaId).
		QueryOne(pg.Scan(&biggestOrder), `
		SELECT MAX("order") FROM ?TableName
		WHERE area_id=?
	`, areaId); err != nil {
		return nil, err
	}

	subject := Subject{
		Id:     uuid.New().String(),
		AreaId: areaId,
		Name:   name,
		Order:  biggestOrder + 1,
	}
	for i := range materials {
		materials[i].SubjectId = subject.Id
	}
	if err := c.DB.RunInTransaction(func(tx *pg.Tx) error {
		if err := c.DB.Insert(&subject); err != nil {
			return err
		}
		if len(materials) != 0 {
			if err := c.DB.Insert(&materials); err != nil {
				return err
			}
		}
		return nil
	}); err != nil {
		return nil, err
	}
	return &subject, nil
}

func (c CurriculumStore) NewArea(name string, curriculumId string) (string, error) {
	id := uuid.New().String()
	area := Area{
		Id:           id,
		CurriculumId: curriculumId,
		Name:         name,
	}
	if err := c.Insert(&area); err != nil {
		return "", err
	}
	return id, nil
}

func (c CurriculumStore) GetArea(areaId string) (*Area, error) {
	var area Area
	if err := c.Model(&area).
		Where("id=?", areaId).
		Select(); err != nil {
		return nil, err
	}
	return &area, nil
}

func (c CurriculumStore) GetAreaSubjects(areaId string) ([]Subject, error) {
	var subjects []Subject
	if err := c.Model(&subjects).
		Where("area_id=?", areaId).
		Select(); err != nil {
		return nil, err
	}
	return subjects, nil
}

func (c CurriculumStore) GetSubjectMaterials(subjectId string) ([]Material, error) {
	var materials []Material
	if err := c.Model(&materials).
		Where("subject_id=?", subjectId).
		Select(); err != nil {
		return nil, err
	}
	return materials, nil
}

func (c CurriculumStore) DeleteArea(id string) error {
	area := Area{Id: id}
	if err := c.DB.Delete(&area); err != nil {
		return err
	}
	return nil
}

func (c CurriculumStore) DeleteSubject(id string) error {
	subject := Subject{Id: id}
	if err := c.DB.Delete(&subject); err != nil {
		return err
	}
	return nil
}
