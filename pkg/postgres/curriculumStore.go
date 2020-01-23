package postgres

import (
	"github.com/go-pg/pg/v9"
)

type CurriculumStore struct {
	*pg.DB
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
