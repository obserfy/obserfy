package imgproxy

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	richErrors "github.com/pkg/errors"
	"os"
)

type Client struct {
	keyBinary   []byte
	saltBinary  []byte
	baseUrl     string
	minioBucket string
}

func (i Client) GenerateUrl(imagePath string, width int, height int) string {
	resize := "fill"
	if width == 0 {
		width = 100
	}
	if height == 0 {
		height = 100
	}
	gravity := "no"
	enlarge := 1

	url := "s3://" + i.minioBucket + "/" + imagePath
	encodedURL := base64.RawURLEncoding.EncodeToString([]byte(url))

	path := fmt.Sprintf("/%s/%d/%d/%s/%d/%s", resize, width, height, gravity, enlarge, encodedURL)

	mac := hmac.New(sha256.New, i.keyBinary)
	mac.Write(i.saltBinary)
	mac.Write([]byte(path))
	signature := base64.RawURLEncoding.EncodeToString(mac.Sum(nil))
	return i.baseUrl + "/" + signature + path
}

func CreateClient() (*Client, error) {
	key := os.Getenv("IMGPROXY_KEY")
	salt := os.Getenv("IMGPROXY_SALT")
	imgproxyUrl := os.Getenv("IMGPROXY_URL")
	minioBucket := os.Getenv("MINIO_BUCKET_NAME")

	var keyBin, saltBin []byte
	var err error

	if keyBin, err = hex.DecodeString(key); err != nil {
		return nil, richErrors.Wrap(err, "Failed to decode imgproxy bin string to hex")
	}

	if saltBin, err = hex.DecodeString(salt); err != nil {
		return nil, richErrors.Wrap(err, "Failed to decode imgproxy salt to hex")
	}

	return &Client{
		keyBinary:   keyBin,
		saltBinary:  saltBin,
		baseUrl:     imgproxyUrl,
		minioBucket: minioBucket,
	}, nil
}
