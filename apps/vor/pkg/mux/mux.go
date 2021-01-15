package mux

import (
	"github.com/chrsep/vor/pkg/domain"
	"github.com/google/uuid"
	muxgo "github.com/muxinc/mux-go"
	richErrors "github.com/pkg/errors"
	"go.uber.org/zap"
	"os"
	"time"
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
