package store

import (
	"github.com/go-pg/pg/v9"

	model "github.com/chrsep/vor/pkg/postgres"
)

type (
		UserStore interface {
			GetUser(userID string) (*model.User, error)
			GetSchools(userID string) ([]model.School, error)
	}

	userstore struct {
		*pg.DB
	}
)

func NewUserStore(database *pg.DB) UserStore {
	return &userstore{database}
}

func (u *userstore) GetUser(userID string) (*model.User, error) {
	var user model.User
	if err := u.Model(&user).
		Column("id", "email", "name").
		Where("id=?", userID).
		Select(); err != nil {
		return nil, err
	}

	return &user, nil
}

func (u *userstore) GetSchools(userID string) ([]model.School, error) {
	var user model.User
	if err := u.Model(&user).
		Relation("Schools").
		Column("id", "email", "name").
		Where("id=?", userID).
		Select(); err != nil {
		return nil, err
	}

	return user.Schools, nil
}