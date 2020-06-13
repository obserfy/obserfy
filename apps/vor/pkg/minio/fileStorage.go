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
	key := GenerateSchoolFileKey(schoolId, fileId)
	if _, err := f.Client.PutObject(f.bucketName, key, file, size, minio.PutObjectOptions{}); err != nil {
		return "", richErrors.Wrap(err, "Failed to upload file to s3")
	}
	return key, nil
}

func (f FileStorage) Delete(schoolId string, fileId string) (string, error) {
	panic("implement me")
}

func (f FileStorage) GetUrl(schoolId string, fileId string) string {
	panic("implement me")
}

func GenerateSchoolFileKey(schoolId string, fileId string) string {
	return "files" + schoolId + "/" + fileId
}
