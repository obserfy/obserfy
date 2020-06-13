package postgres

import "mime/multipart"

type FileStorage interface {
	Save(schoolId string, fileId string, file multipart.File, size int64) (string, error)
	Delete(schoolId string, fileId string) (string, error)
	GetUrl(schoolId string, fileId string) string
}
