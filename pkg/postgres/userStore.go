package postgres

import (
	"github.com/go-pg/pg/v9"
)

type UserStore struct {
	*pg.DB
}

func (u UserStore) GetUser(userId string) (*User, error) {
	var user User
	if err := u.Model(&user).
		Column("id", "email", "name").
		Where("id=?", userId).
		Select(); err != nil {
		return nil, err
	}
	return &user, nil
}

func (u UserStore) GetSchools(userId string) ([]School, error) {
	var user User
	if err := u.Model(&user).
		Relation("Schools").
		Column("id", "email", "name").
		Where("id=?", userId).
		Select(); err != nil {
		return nil, err
	}
	return user.Schools, nil
}
