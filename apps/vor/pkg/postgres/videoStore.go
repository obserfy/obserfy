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

func (s VideoStore) UpdateVideo(video domain.Video) error {
	v := Video{
		Id:         video.Id,
		Status:     video.Status,
		AssetId:    video.AssetId,
		PlaybackId: video.PlaybackId,
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
