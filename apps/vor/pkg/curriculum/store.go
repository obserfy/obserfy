package curriculum

import "github.com/chrsep/vor/pkg/domain"

type Store interface {
	GetArea(areaId string) (*domain.Area, error)
	GetAreaSubjects(areaId string) ([]domain.Subject, error)
	GetSubjectMaterials(subjectId string) ([]domain.Material, error)
	GetMaterial(materialId string) (*domain.Material, error)
	NewArea(name string, curriculumId string) (*domain.Area, error)
	NewSubject(name string, areaId string, materials []domain.Material) (*domain.Subject, error)
	NewMaterial(name string, subjectId string) (*domain.Material, error)
	GetSubject(id string) (*domain.Subject, error)
	UpdateMaterial(material *domain.Material, order *int) error
	DeleteArea(id string) error
	DeleteSubject(id string) error
	ReplaceSubject(subject domain.Subject) error
	UpdateArea(areaId string, name string) error
	CheckSubjectPermissions(subjectId string, userId string) (bool, error)
	CheckAreaPermissions(subjectId string, userId string) (bool, error)
	CheckCurriculumPermission(curriculumId string, userId string) (bool, error)
	CheckMaterialPermission(materialId string, userId string) (bool, error)
}
