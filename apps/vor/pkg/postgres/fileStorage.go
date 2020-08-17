package postgres

import "mime/multipart"

type FileStorage interface {
	Save(schoolId string, fileId string, file multipart.File, size int64) (string, error)
	Delete(key string) error
}

type ImageStorage interface {
	Save(schoolId string, imageId string, image multipart.File, size int64) (string, error)
	Delete(key string) error
}
