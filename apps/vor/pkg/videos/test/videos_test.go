package video_test

import (
	"github.com/chrsep/vor/pkg/domain"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/testutils"
	"github.com/chrsep/vor/pkg/videos"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"net/http"
	"testing"
)

func TestVideoTestSuite(t *testing.T) {
	suite.Run(t, new(VideoTestSuite))
}

type VideoTestSuite struct {
	testutils.BaseTestSuite
	store   domain.VideoStore
	service domain.VideoService
}

func (s *VideoTestSuite) SetupTest() {
	s.store = postgres.VideoStore{DB: s.DB}
	s.service = domain.NoopVideoService{}
	s.Handler = videos.NewRouter(s.Server, s.store, s.service).ServeHTTP
}

func (s *VideoTestSuite) TestDeleteVideo() {
	t := s.T()
	school, _ := s.GenerateSchool()
	video := s.GenerateVideo(school, nil)

	result := s.CreateRequest("DELETE", "/"+video.Id.String(), nil, &school.Users[0].Id)
	assert.Equal(t, http.StatusOK, result.Code)

	// should properly delete the video
	videoInDB := postgres.Video{Id: video.Id}
	err := s.DB.Model(&videoInDB).WherePK().Select()
	assert.Error(t, err)
}

func (s *VideoTestSuite) TestUnauthorizedDeleteVideo() {
	t := s.T()
	school, _ := s.GenerateSchool()
	otherSchool, _ := s.GenerateSchool()
	video := s.GenerateVideo(school, nil)

	result := s.CreateRequest("DELETE", "/"+video.Id.String(), nil, &otherSchool.Users[0].Id)
	assert.Equal(t, http.StatusUnauthorized, result.Code)

	// should be able to find video if delete fails
	videoInDB := postgres.Video{Id: video.Id}
	err := s.DB.Model(&videoInDB).WherePK().Select()
	assert.NoError(t, err)
	assert.Equal(t, video.ThumbnailUrl, videoInDB.ThumbnailUrl)
}
