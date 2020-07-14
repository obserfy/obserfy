package minio

import (
	"github.com/google/uuid"
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

func (m ImageStorage) SaveProfilePicture(studentId string, pic multipart.File, size int64) (string, error) {
	objectName := uuid.New().String() + ".png"
	objectLocation := "images/" + studentId + "/" + objectName
	_, err := m.Client.PutObject(m.bucketName, objectLocation, pic, size, minio.PutObjectOptions{})
	if err != nil {
		return "", err
	}
	return objectLocation, nil
}

func (m ImageStorage) Save(schoolId string, imageId string, image multipart.File, size int64) (string, error) {
	key := "files/" + schoolId + "/" + imageId
	if _, err := m.Client.PutObject(m.bucketName, key, image, size, minio.PutObjectOptions{}); err != nil {
		return "", richErrors.Wrap(err, "Failed to upload file to s3")
	}
	return key, nil
}
