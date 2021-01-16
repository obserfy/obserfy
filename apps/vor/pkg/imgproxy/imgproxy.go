package imgproxy

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
)

//GenerateUrlFromS3 generates a URL for an imgproxy optimized image use S3 as source
func GenerateUrlFromS3(imageObjectKey string, width int, height int) string {
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
	S3Url := generateFullS3Url(imageObjectKey)
	imgproxyUrl := fmt.Sprintf("/%s/%d/%d/%s/%d/%s", resize, width, height, gravity, enlarge, S3Url)
	return signUrl(imgproxyUrl)
}

//GenerateOriginalUrlFromS3 generates the URL for an optimized image from imgproxy at maximum quality, using an S3 object as source
func GenerateOriginalUrlFromS3(imageObjectKey string) string {
	S3Url := generateFullS3Url(imageObjectKey)
	imgproxyUrl := fmt.Sprintf("/%s", S3Url)
	return signUrl(imgproxyUrl)
}

//generateFullS3Url generates a full S3 url from an object key
func generateFullS3Url(objectKey string) string {
	config := mustGetConfig()
	return base64.RawURLEncoding.EncodeToString(
		[]byte("s3://" + config.minioBucket + "/" + objectKey),
	)
}

//signUrl sign the imgproxy URL
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

//GenerateUrlFromHttp
func GenerateUrlFromHttp(url string, width int, height int) string {
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

	// Create base64 image url
	S3Url := base64.RawURLEncoding.EncodeToString([]byte(url))
	imgproxyUrl := fmt.Sprintf("/%s/%d/%d/%s/%d/%s", resize, width, height, gravity, enlarge, S3Url)
	return signUrl(imgproxyUrl)
}
