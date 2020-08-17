package minio

import (
	"github.com/minio/minio-go/v6"
	richErrors "github.com/pkg/errors"
	"mime/multipart"
	"os"
)

type ImageStorage struct {
	*minio.Client
	bucketName string
}

func NewImageStorage(client *minio.Client) *ImageStorage {
	bucketName := os.Getenv("MINIO_BUCKET_NAME")

	imageStorage := ImageStorage{client, bucketName}
	return &imageStorage
}

func (m ImageStorage) Save(schoolId string, imageId string, image multipart.File, size int64) (string, error) {
	key := "images/" + schoolId + "/" + imageId
	if _, err := m.Client.PutObject(m.bucketName, key, image, size, minio.PutObjectOptions{}); err != nil {
		return "", richErrors.Wrap(err, "Failed to upload file to s3")
	}
	return key, nil
}

func (m ImageStorage) Delete(key string) error {
	if err := m.Client.RemoveObject(m.bucketName, key); err != nil {
		return richErrors.Wrap(err, "Failed to upload file to s3")
	}
	return nil
}
