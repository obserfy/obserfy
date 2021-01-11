package mux

import (
	muxgo "github.com/muxinc/mux-go"
	richErrors "github.com/pkg/errors"
	"go.uber.org/zap"
	"os"
)

// NewBillingService creates a new paddle.BillingService
func NewVideoService(logger *zap.Logger) (VideoService, error) {
	accessToken := os.Getenv("MUX_ACCESS_TOKEN")
	secretKey := os.Getenv("MUX_SECRET_KEY")

	if accessToken == "" || secretKey == "" {
		return VideoService{}, richErrors.New("empty paddle credentials")
	}

	client := muxgo.NewAPIClient(
		muxgo.NewConfiguration(
			muxgo.WithBasicAuth(accessToken, secretKey),
		),
	)

	return VideoService{
		client: client,
		logger: logger,
	}, nil
}

type VideoService struct {
	client *muxgo.APIClient
	logger *zap.Logger
}
