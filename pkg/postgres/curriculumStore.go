package postgres

import (
	"github.com/go-pg/pg/v9"
	"github.com/google/uuid"
)

type CurriculumStore struct {
	*pg.DB
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

func (c CurriculumStore) NewSubject(name string, areaId string) (*Subject, error) {
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
	if err := c.DB.Insert(&subject); err != nil {
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
