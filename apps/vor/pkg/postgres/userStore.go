package postgres

import (
	"github.com/go-pg/pg/v9"

	"github.com/chrsep/vor/pkg/user"
)

type UserStore struct {
	*pg.DB
}

func (u UserStore) GetUser(userId string) (*user.User, error) {
	var model User
	if err := u.Model(&model).
		Column("id", "email", "name").
		Where("id=?", userId).
		Select(); err != nil {
		return nil, err
	}
	return &user.User{
		Id:    model.Id,
		Email: model.Email,
		Name:  model.Name,
	}, nil
}

func (u UserStore) GetSchools(userId string) ([]user.UserSchool, error) {
	res := []user.UserSchool{}
	var model User
	if err := u.Model(&model).
		Relation("Schools").
		Where("id=?", userId).
		Select(); err != nil {
		return nil, err
	}

	for _, v := range model.Schools {
		res = append(res, user.UserSchool{
			Id:   v.Id,
			Name: v.Name,
		})
	}

	return res, nil
}
