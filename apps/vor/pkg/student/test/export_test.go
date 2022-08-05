package student_test

import (
	"github.com/chrsep/vor/pkg/domain"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/student"
	"github.com/stretchr/testify/assert"
)

func (s *StudentTestSuite) TestExportCurriculumPdf() {
	t := s.T()
	school, _ := s.GenerateSchool()

	curriculum := school.Curriculum
	area := s.generateCompleteArea(school)
	curriculum.Areas = append(curriculum.Areas, area)
	area = s.generateCompleteArea(school)
	curriculum.Areas = append(curriculum.Areas, area)
	area = s.generateCompleteArea(school)
	curriculum.Areas = append(curriculum.Areas, area)

	areas := make([]domain.Area, 0)
	for _, a := range curriculum.Areas {
		subjects := make([]domain.Subject, 0)
		for _, s := range a.Subjects {
			materials := make([]domain.Material, 0)
			for _, m := range s.Materials {
				materials = append(materials, domain.Material{
					Id:          m.Id,
					SubjectId:   m.SubjectId,
					Name:        m.Name,
					Order:       m.Order,
					Description: m.Description,
				})
			}
			subjects = append(subjects, domain.Subject{
				Id:          s.Id,
				AreaId:      s.AreaId,
				Name:        s.Name,
				Order:       s.Order,
				Description: s.Description,
				Materials:   materials,
			})
		}
		areas = append(areas, domain.Area{
			Id:          a.Id,
			Name:        a.Name,
			Subjects:    subjects,
			Description: a.Description,
		})
	}

	var progress []postgres.StudentMaterialProgress
	pdf, _ := student.ExportCurriculumPdf(domain.Curriculum{
		Id:          curriculum.Id,
		Name:        curriculum.Name,
		Areas:       areas,
		Description: curriculum.Descriptions,
	}, progress)
	err := pdf.WritePdf("test.pdf")
	assert.NoError(t, err)
}

func (s *StudentTestSuite) generateCompleteArea(school *postgres.School) postgres.Area {
	area, _ := s.GenerateArea(school)

	subject := s.generateCompleteSubject(school)
	area.Subjects = append(area.Subjects, subject)
	subject = s.generateCompleteSubject(school)
	area.Subjects = append(area.Subjects, subject)
	subject = s.generateCompleteSubject(school)
	area.Subjects = append(area.Subjects, subject)
	return area
}

func (s *StudentTestSuite) generateCompleteSubject(school *postgres.School) postgres.Subject {
	subject, _ := s.GenerateSubject(school)

	material, _ := s.GenerateMaterial(school)
	subject.Materials = append(subject.Materials, material)
	material, _ = s.GenerateMaterial(school)
	subject.Materials = append(subject.Materials, material)
	material, _ = s.GenerateMaterial(school)
	subject.Materials = append(subject.Materials, material)
	material, _ = s.GenerateMaterial(school)
	subject.Materials = append(subject.Materials, material)
	material, _ = s.GenerateMaterial(school)
	subject.Materials = append(subject.Materials, material)

	return subject
}
