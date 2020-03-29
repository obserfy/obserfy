package curriculum

import "github.com/chrsep/vor/pkg/postgres"

type Store interface {
	GetArea(areaId string) (*postgres.Area, error)
	GetAreaSubjects(areaId string) ([]postgres.Subject, error)
	GetSubjectMaterials(subjectId string) ([]postgres.Material, error)
	GetMaterial(materialId string) (*postgres.Material, error)
	NewArea(name string, curriculumId string) (string, error)
	NewSubject(name string, areaId string, materials []postgres.Material) (*postgres.Subject, error)
	NewMaterial(name string, subjectId string) (*postgres.Material, error)
	GetSubject(id string) (*postgres.Subject, error)
	UpdateMaterial(material *postgres.Material, order *int) error
	DeleteArea(id string) error
	DeleteSubject(id string) error
	ReplaceSubject(subject postgres.Subject) error
	UpdateArea(areaId string, name string) error
	CheckSubjectPermissions(subjectId string, userId string) (bool, error)
	CheckAreaPermissions(subjectId string, userId string) (bool, error)
	CheckCurriculumPermission(curriculumId string, userId string) (bool, error)
	CheckMaterialPermission(materialId string, userId string) (bool, error)
}
