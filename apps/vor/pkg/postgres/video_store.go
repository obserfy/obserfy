package postgres

import (
	"github.com/chrsep/vor/pkg/domain"
	"github.com/go-pg/pg/v10"
	"github.com/google/uuid"
	richErrors "github.com/pkg/errors"
)

type VideoStore struct {
	*pg.DB
}

func (s VideoStore) GetVideoSchool(videoId uuid.UUID) (domain.School, error) {
	v := Video{
		Id: videoId,
	}
	if err := s.Model(&v).
		WherePK().
		Relation("School").
		Relation("School.Users").
		Select(); err != nil {
		return domain.School{}, richErrors.Wrap(err, "")
	}

	school := domain.School{
		Id:   uuid.MustParse(v.School.Id),
		Name: v.School.Name,
	}

	for _, user := range v.School.Users {
		school.Users = append(school.Users, domain.User{
			Id:    user.Id,
			Name:  user.Name,
			Email: user.Email,
		})
	}

	return school, nil
}

func (s VideoStore) GetVideo(videoId uuid.UUID) (domain.Video, error) {
	v := Video{
		Id: videoId,
	}
	if err := s.Model(&v).
		WherePK().
		Select(); err != nil {
		return domain.Video{}, richErrors.Wrap(err, "")
	}

	return domain.Video{
		Id:            v.Id,
		UploadUrl:     v.UploadUrl,
		UploadId:      v.UploadId,
		Status:        v.Status,
		UploadTimeout: v.UploadTimeout,
		CreatedAt:     v.CreatedAt,
		UserId:        v.UserId,
		SchoolId:      v.SchoolId,
		AssetId:       v.AssetId,
		PlaybackId:    v.PlaybackId,
		PlaybackUrl:   v.PlaybackUrl,
		ThumbnailUrl:  v.ThumbnailUrl,
	}, nil
}

func (s VideoStore) UpdateVideo(video domain.Video) error {
	v := Video{
		Id:           video.Id,
		Status:       video.Status,
		AssetId:      video.AssetId,
		PlaybackId:   video.PlaybackId,
		PlaybackUrl:  video.PlaybackUrl,
		ThumbnailUrl: video.ThumbnailUrl,
	}
	if _, err := s.Model(&v).WherePK().UpdateNotZero(); err != nil {
		return richErrors.Wrap(err, "failed to update video")
	}

	return nil
}

func (s VideoStore) DeleteVideo(id uuid.UUID) error {
	video := Video{Id: id}
	if _, err := s.Model(&video).WherePK().Delete(); err != nil {
		return richErrors.Wrap(err, "failed to delete video")
	}

	return nil
}
