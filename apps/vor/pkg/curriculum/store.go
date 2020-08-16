package curriculum

type (
	Area struct {
		Id   string
		Name string
	}

	Subject struct {
		Id        string
		AreaId    string
		Name      string
		Order     int
		Materials []Material
	}

	Material struct {
		Id        string
		SubjectId string
		Subject   Subject
		Name      string
		Order     int
	}

	Store interface {
		GetArea(areaId string) (*Area, error)
		GetAreaSubjects(areaId string) ([]Subject, error)
		GetSubjectMaterials(subjectId string) ([]Material, error)
		GetMaterial(materialId string) (*Material, error)
		NewArea(name string, curriculumId string) (string, error)
		NewSubject(name string, areaId string, materials []Material) (*Subject, error)
		NewMaterial(name string, subjectId string) (*Material, error)
		GetSubject(id string) (*Subject, error)
		UpdateMaterial(material *Material, order *int) error
		DeleteArea(id string) error
		DeleteSubject(id string) error
		ReplaceSubject(subject Subject) error
		UpdateArea(areaId string, name string) error
		CheckSubjectPermissions(subjectId string, userId string) (bool, error)
		CheckAreaPermissions(subjectId string, userId string) (bool, error)
		CheckCurriculumPermission(curriculumId string, userId string) (bool, error)
		CheckMaterialPermission(materialId string, userId string) (bool, error)
	}
)
