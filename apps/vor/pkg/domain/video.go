package domain

// VideoService handle the interaction with 3rd party video service
type VideoService interface {
	// CreateUploadLink creates a url to directly upload video to 3rd party service.
	CreateUploadLink() (Video, error)
	DeleteAsset(assetId string) error
}

type NoopVideoService struct{}

func (n NoopVideoService) DeleteAsset(_ string) error {
	return nil
}

func (n NoopVideoService) CreateUploadLink() (Video, error) {
	return Video{}, nil
}
