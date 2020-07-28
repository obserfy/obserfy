package postgres

import (
	"github.com/chrsep/vor/pkg/user"
	"github.com/go-pg/pg/v10"
	richErrors "github.com/pkg/errors"
	"strings"
)

type UserStore struct {
	*pg.DB
}

func (u UserStore) AddSchool(userId string, inviteCode string) error {
	var school School
	if err := u.Model(&school).
		Column("id").
		Where("invite_code=?", inviteCode).
		Select(); err != nil {
		return richErrors.Wrap(err, "failed to get school by invite_code")
	}

	userToSchool := UserToSchool{
		UserId:   userId,
		SchoolId: school.Id,
	}
	if _, err := u.Model(&userToSchool).
		Insert(); err != nil && strings.Contains(err.Error(), "#23505") {
	} else if err != nil {
		return richErrors.Wrap(err, "failed to insert user to school relation")
	}
	return nil
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
