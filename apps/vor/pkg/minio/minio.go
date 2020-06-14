package minio

import (
	"github.com/minio/minio-go/v6"
	richErrors "github.com/pkg/errors"
	"os"
)

func NewClient() (*minio.Client, error) {
	endpoint := os.Getenv("MINIO_ENDPOINT")
	accessKey := os.Getenv("MINIO_ACCESS_KEY")
	secretKey := os.Getenv("MINIO_SECRET_KEY")
	bucketName := os.Getenv("MINIO_BUCKET_NAME")
	bucketLocation := os.Getenv("MINIO_BUCKET_LOCATION")
	useSSL := os.Getenv("ENV") == "production"

	client, err := minio.New(endpoint, accessKey, secretKey, useSSL)
	if err != nil {
		return nil, richErrors.Wrap(err, "failed creating minio client")
	}

	exists, err := client.BucketExists(bucketName)
	if err != nil {
		return nil, richErrors.Wrap(err, "failed checking bucket existence")
	}
	if !exists {
		err := client.MakeBucket(bucketName, bucketLocation)
		if err != nil {
			return nil, richErrors.Wrap(err, "failed creating specified bucket")
		}
	}
	return client, nil
}
