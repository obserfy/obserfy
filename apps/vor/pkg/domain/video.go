package domain

// VideoService handle the interaction with 3rd party video service
type VideoService interface {
	// CreateUploadLink creates a url to directly upload video to 3rd party service.
	CreateUploadLink() (Video, error)
}

type NoopVideoService struct{}

func (n NoopVideoService) CreateUploadLink() (Video, error) {
	return Video{}, nil
}
