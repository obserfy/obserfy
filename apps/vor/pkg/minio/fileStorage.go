package minio

import (
	"github.com/minio/minio-go/v6"
	"os"
)

type FileStorage struct {
	*minio.Client
	bucketName string
}

func NewFileStorage(client *minio.Client) *FileStorage {
	bucketName := os.Getenv("MINIO_BUCKET_NAME")

	fileStorage := FileStorage{client, bucketName}
	return &fileStorage
}
