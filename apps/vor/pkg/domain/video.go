package domain

type VideoService interface {
	CreateUploadLink(schoolId string) (string, error)
}

type NoopVideoService struct{}

func (n NoopVideoService) CreateUploadLink(schoolId string) (string, error) {
	return "/" + schoolId, nil
}
