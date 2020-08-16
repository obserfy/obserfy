package minio

import (
	"github.com/minio/minio-go/v6"
	richErrors "github.com/pkg/errors"
	"mime/multipart"
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

func (f FileStorage) Save(schoolId string, fileId string, file multipart.File, size int64) (string, error) {
	key := "files/" + schoolId + "/" + fileId
	if _, err := f.Client.PutObject(f.bucketName, key, file, size, minio.PutObjectOptions{}); err != nil {
		return "", richErrors.Wrap(err, "Failed to upload file to s3")
	}
	return key, nil
}

func (f FileStorage) Delete(key string) error {
	if err := f.Client.RemoveObject(f.bucketName, key); err != nil {
		return richErrors.Wrap(err, "Failed to upload file to s3")
	}
	return nil
}
