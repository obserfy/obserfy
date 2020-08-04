package postgres

import (
	"github.com/go-pg/pg/v10"
	"github.com/google/uuid"
	richErrors "github.com/pkg/errors"
)

type LinksStore struct {
	*pg.DB
}

func (s LinksStore) UpdateLink(id string, title *string, url *string, image *string, description *string) error {
	linkUpdateModel := make(PartialUpdateModel)
	linkUpdateModel.AddStringColumn("title", title)
	linkUpdateModel.AddStringColumn("url", url)
	linkUpdateModel.AddStringColumn("image", image)
	linkUpdateModel.AddStringColumn("description", description)
	if _, err := s.Model(linkUpdateModel.
		GetModel()).
		TableExpr("lesson_plan_links").
		Where("id = ?", id).
		Update(); err != nil {
		return richErrors.Wrap(err, "failed to update link")
	}

	return nil
}

func (s LinksStore) DeleteLink(id uuid.UUID) error {
	link := LessonPlanLink{Id: id}
	if _, err := s.Model(&link).WherePK().Delete(); err != nil {
		return richErrors.Wrap(err, "failed to delete link")
	}
	return nil
}
