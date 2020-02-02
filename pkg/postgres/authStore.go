package postgres

import (
	"github.com/go-pg/pg/v9"
	"github.com/google/uuid"
	richErrors "github.com/pkg/errors"
)

type AuthStore struct {
	*pg.DB
}

func (a AuthStore) ResolveInviteCode(inviteCodeId string) (*School, error) {
	var school School
	if err := a.Model(&school).
		Where("invite_code=?", inviteCodeId).
		Select(); err != nil {
		return nil, richErrors.Wrap(err, "invite code:"+inviteCodeId)
	}
	return &school, nil
}

func (a AuthStore) GetUserByEmail(email string) (*User, error) {
	var user User
	if err := a.Model(&user).
		Where("email=?", email).
		First(); err != nil {
		return nil, richErrors.Wrap(err, "email: "+email)
	}
	return &user, nil
}

func (a AuthStore) NewSession(userId string) (*Session, error) {
	session := Session{uuid.New().String(), userId}
	if err := a.Insert(&session); err != nil {
		return nil, richErrors.Wrap(err, "user id:"+userId)
	}
	return &session, nil
}

func (a AuthStore) NewUser(email string, hashedPassword []byte, name string, inviteCode string) (*User, error) {
	user := User{
		Id:       uuid.New().String(),
		Email:    email,
		Name:     name,
		Password: hashedPassword,
	}
	if err := a.Insert(&user); err != nil {
		return nil, richErrors.Wrap(err, "email:"+email)
	}

	// TODO: This should be done in a transsaction
	// Create relation between user and associated school if use has invite code
	if inviteCode != "" {
		var school School
		// Search for school associated with invite code
		if err := a.Model(&school).
			Where("invite_code=?", inviteCode).
			Select(); err != nil {
			return nil, richErrors.Wrap(err, "invite code:"+inviteCode)
		}

		userSchoolRelation := UserToSchool{school.Id, user.Id}
		if err := a.Insert(&userSchoolRelation); err != nil {
			return nil, richErrors.Wrap(err, "invite code:"+inviteCode)
		}
	}
	return &user, nil
}

func (a AuthStore) GetSession(token string) (*Session, error) {
	var session Session
	if err := a.Model(&session).
		Where("token=?", token).
		Select(); err != nil {
		return nil, richErrors.Wrap(err, "Failed getting session")
	}
	return &session, nil
}

func (a AuthStore) DeleteSession(token string) error {
	session := Session{Token: token}
	if err := a.Delete(&session); err != nil {
		return richErrors.Wrap(err, "Failed deleting session")
	}
	return nil
}
