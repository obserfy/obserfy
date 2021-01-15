package domain

type VideoService interface {
	CreateUploadLink(schoolId string) (Video, error)
}

type NoopVideoService struct{}

func (n NoopVideoService) CreateUploadLink(_ string) (Video, error) {
	return Video{}, nil
}
