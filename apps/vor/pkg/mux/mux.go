package mux

import (
	muxgo "github.com/muxinc/mux-go"
	"go.uber.org/zap"
	"os"
)

// NewBillingService creates a new paddle.BillingService
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

type VideoService struct {
	corsOrigin string
	client     *muxgo.APIClient
	log        *zap.Logger
}

func (s VideoService) CreateUploadLink(schoolId string) (string, error) {
	response, err := s.client.DirectUploadsApi.CreateDirectUpload(muxgo.CreateUploadRequest{
		Timeout:    60,
		CorsOrigin: s.corsOrigin,
		NewAssetSettings: muxgo.CreateAssetRequest{
			PlaybackPolicy: []muxgo.PlaybackPolicy{muxgo.PUBLIC},
			PerTitleEncode: true,
			Passthrough:    schoolId,
		},
	})
	if err != nil {
		return "", err
	}
	return response.Data.Url, nil
}
