package postgres

type FileStorage interface {
	Save(schoolId string, fileId string) (string, error)
	Delete(schoolId string, fileId string) (string, error)
	GetUrl(schoolId string, fileId string) string
}
