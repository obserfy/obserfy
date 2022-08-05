package images_test

import (
	"github.com/chrsep/vor/pkg/images"
	"github.com/chrsep/vor/pkg/minio"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/testutils"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"net/http"
	"testing"
)

type ImagesTestSuite struct {
	testutils.BaseTestSuite
	store images.Store
}

func (s *ImagesTestSuite) SetupTest() {
	t := s.T()
	minioClient, err := minio.NewClient()
	assert.NoError(t, err)
	s.store = postgres.ImageStore{DB: s.DB, ImageStorage: minio.NewImageStorage(minioClient)}
	s.Handler = images.NewRouter(s.Server, s.store).ServeHTTP
}

func TestImagesApi(t *testing.T) {
	suite.Run(t, new(ImagesTestSuite))
}

func (s *ImagesTestSuite) TestGetImages() {
	t := s.T()
	school, _ := s.GenerateSchool()
	image := s.GenerateImage(school)

	tests := []struct {
		name   string
		id     string
		code   int
		result postgres.Image
	}{
		// TODO: test cases
		{"existing image", image.Id.String(), http.StatusOK, image},
		{"random id image", uuid.New().String(), http.StatusNotFound, postgres.Image{}},
		{"invalid uuid", "asdfasfasdfa", http.StatusNotFound, postgres.Image{}},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			result := s.CreateRequest("GET", "/"+test.id, nil, nil)
			assert.Equal(t, test.code, result.Code)
		})
	}
}
