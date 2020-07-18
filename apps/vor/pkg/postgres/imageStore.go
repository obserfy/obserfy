package postgres

import (
	"github.com/chrsep/vor/pkg/domain"
	"github.com/go-pg/pg/v10"
	"github.com/google/uuid"
	richErrors "github.com/pkg/errors"
)

type ImageStore struct {
	*pg.DB
}

func (s ImageStore) FindImageById(id uuid.UUID) (domain.Image, error) {
	image := Image{Id: id}
	if err := s.DB.Model(&image).
		WherePK().
		Select(); err == pg.ErrNoRows {
		return domain.Image{}, nil
	} else if err != nil {
		return domain.Image{}, richErrors.Wrap(err, "failed to query image data")
	}

	return domain.Image{
		Id:        image.Id,
		ObjectKey: image.ObjectKey,
		CreatedAt: image.CreatedAt,
	}, nil
}
