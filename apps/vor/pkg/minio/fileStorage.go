package minio

import (
	"github.com/minio/minio-go/v6"
	"os"
)

func NewFileStorage(client *minio.Client) *FileStorage {
	bucketName := os.Getenv("MINIO_BUCKET_NAME")

	fileStorage := FileStorage{client, bucketName}
	return &fileStorage
}

type FileStorage struct {
	*minio.Client
	bucketName string
}

func (f FileStorage) Save(schoolId string, fileId string) (string, error) {
	panic("implement me")
}

func (f FileStorage) Delete(schoolId string, fileId string) (string, error) {
	panic("implement me")
}

func (f FileStorage) GetUrl(schoolId string, fileId string) string {
	panic("implement me")
}
