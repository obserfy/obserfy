package imgproxy

import (
	"encoding/hex"
	richErrors "github.com/pkg/errors"
	"os"
)

type config struct {
	keyBinary   []byte
	saltBinary  []byte
	baseUrl     string
	minioBucket string
}

var c *config

func mustGetConfig() *config {
	if c != nil {
		return c
	}
	// Generate imgproxy config, will throw if env is invalid
	key := os.Getenv("IMGPROXY_KEY")
	salt := os.Getenv("IMGPROXY_SALT")
	imgproxyUrl := os.Getenv("IMGPROXY_URL")
	minioBucket := os.Getenv("MINIO_BUCKET_NAME")

	var keyBin, saltBin []byte
	var err error

	if keyBin, err = hex.DecodeString(key); err != nil {
		panic(richErrors.Wrap(err, "Invalid imgproxy key"))
	}

	if saltBin, err = hex.DecodeString(salt); err != nil {
		panic(richErrors.Wrap(err, "Invalid imgproxy salt"))
	}

	return &config{
		keyBinary:   keyBin,
		saltBinary:  saltBin,
		baseUrl:     imgproxyUrl,
		minioBucket: minioBucket,
	}
}
