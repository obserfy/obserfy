package mux

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"github.com/chrsep/vor/pkg/domain"
	"github.com/google/uuid"
	muxgo "github.com/muxinc/mux-go"
	richErrors "github.com/pkg/errors"
	"go.uber.org/zap"
	"os"
	"strconv"
	"strings"
	"time"
)

// NewVideoService creates a new VideoService powerred by Mux
func NewVideoService(logger *zap.Logger) VideoService {
	accessToken := os.Getenv("MUX_ACCESS_TOKEN")
	secretKey := os.Getenv("MUX_SECRET_KEY")
	corsOrigin := os.Getenv("MUX_CORS_ORIGIN")

	if accessToken == "" {
		logger.Warn("invalid mux access token")
	}
	if secretKey == "" {
		logger.Warn("invalid mux secret")
	}
	if corsOrigin == "" {
		logger.Warn("invalid mux cors origin")
	}

	client := muxgo.NewAPIClient(
		muxgo.NewConfiguration(
			muxgo.WithBasicAuth(accessToken, secretKey),
		),
	)

	return VideoService{
		log:        logger,
		corsOrigin: corsOrigin,
		client:     client,
	}
}

// mux.VideoService is a video service that uses mux as the backend
type VideoService struct {
	corsOrigin string
	client     *muxgo.APIClient
	log        *zap.Logger
}

func (s VideoService) DeleteAsset(assetId string) error {
	if err := s.client.AssetsApi.DeleteAsset(assetId); err != nil {
		return richErrors.Wrap(err, "failed to delete asset from mux")
	}

	return nil
}

func (s VideoService) CreateUploadLink() (domain.Video, error) {
	id := uuid.New()
	response, err := s.client.DirectUploadsApi.CreateDirectUpload(muxgo.CreateUploadRequest{
		Timeout:    60,
		CorsOrigin: s.corsOrigin,
		NewAssetSettings: muxgo.CreateAssetRequest{
			PlaybackPolicy: []muxgo.PlaybackPolicy{muxgo.PUBLIC},
			PerTitleEncode: true,
			Passthrough:    id.String(),
		},
	})

	if err != nil {
		message := response.Data.Error.Message
		return domain.Video{}, richErrors.Wrap(err, message)
	}

	return domain.Video{
		Id:            id,
		Status:        response.Data.Status,
		UploadUrl:     response.Data.Url,
		UploadId:      response.Data.Id,
		UploadTimeout: response.Data.Timeout,
		AssetId:       response.Data.AssetId,
		CreatedAt:     time.Now(),
	}, nil
}

func VerifySignature(body string, header string) error {
	requestTime, signature, payload := parseHeader(body, header)
	secret := os.Getenv("MUX_WEBHOOK_SIGNING_SECRET")

	if err := validateSignature(payload, secret, signature); err != nil {
		return err
	}

	if err := validateTiming(requestTime); err != nil {
		return err
	}
	return nil
}

//validateSignature makes sure that signature is correct
func validateSignature(payload string, secret string, signature string) error {
	expectedSignature := calculateHmacSha256(payload, secret)
	isValid := hmac.Equal([]byte(signature), []byte(expectedSignature))
	if !isValid {
		return richErrors.New("invalid signature")
	}
	return nil
}

//validateTiming prevents reuse of signature older than 5 minutes
func validateTiming(requestTime string) error {
	unixTime, _ := strconv.ParseInt(requestTime, 10, 64)
	timestamp := time.Unix(unixTime, 0)
	now := time.Now()

	if now.Sub(timestamp).Minutes() > 5 {
		return richErrors.New("invalid signature")
	}
	return nil
}

//parseHeader extract required values from passed in header
func parseHeader(body string, signature string) (string, string, string) {
	values := strings.Split(signature, ",")
	t := strings.Replace(values[0], "t=", "", 1)
	sign := strings.Replace(values[1], "v1=", "", 1)
	payload := t + "." + body
	return t, sign, payload
}

func calculateHmacSha256(payload string, secret string) string {
	h := hmac.New(sha256.New, []byte(secret))
	h.Write([]byte(payload))
	return hex.EncodeToString(h.Sum(nil))
}
