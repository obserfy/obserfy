package imgproxy

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
)

func GenerateUrl(imageObjectKey string, width int, height int) string {
	// Create sane default transformation
	gravity := "no"
	enlarge := 1
	resize := "fill"
	if width == 0 {
		width = 100
	}
	if height == 0 {
		height = 100
	}

	// Create image's S3 URL
	S3Url := generateBase64S3Url(imageObjectKey)
	imgproxyUrl := fmt.Sprintf("/%s/%d/%d/%s/%d/%s", resize, width, height, gravity, enlarge, S3Url)
	return signUrl(imgproxyUrl)
}

func GenerateOriginalUrl(imageObjectKey string) string {
	S3Url := generateBase64S3Url(imageObjectKey)
	imgproxyUrl := fmt.Sprintf("/%s", S3Url)
	return signUrl(imgproxyUrl)
}

func generateBase64S3Url(objectKey string) string {
	config := mustGetConfig()
	return base64.RawURLEncoding.EncodeToString(
		[]byte("s3://" + config.minioBucket + "/" + objectKey),
	)
}

func signUrl(url string) string {
	config := mustGetConfig()

	// Create signature
	mac := hmac.New(sha256.New, config.keyBinary)
	mac.Write(config.saltBinary)
	mac.Write([]byte(url))
	signature := base64.RawURLEncoding.EncodeToString(mac.Sum(nil))

	// Create signed url
	return config.baseUrl + "/" + signature + url
}
