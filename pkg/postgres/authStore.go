package postgres

import (
	"github.com/go-pg/pg/v9"
	"github.com/google/uuid"
	richErrors "github.com/pkg/errors"
	"golang.org/x/crypto/bcrypt"
	"time"
)

const (
	BCryptCost = 10
)

type AuthStore struct {
	DB *pg.DB
}

func (a AuthStore) ResolveInviteCode(inviteCodeId string) (*School, error) {
	var school School
	if err := a.DB.Model(&school).
		Where("invite_code=?", inviteCodeId).
		Select(); err != nil {
		return nil, richErrors.Wrap(err, "invite code:"+inviteCodeId)
	}
	return &school, nil
}

func (a AuthStore) GetUserByEmail(email string) (*User, error) {
	var user User
	if err := a.DB.Model(&user).
		Where("email=?", email).
		First(); err == pg.ErrNoRows {
		return nil, nil
	} else if err != nil {
		return nil, richErrors.Wrap(err, "email: "+email)
	}
	return &user, nil
}

func (a AuthStore) NewSession(userId string) (*Session, error) {
	session := Session{uuid.New().String(), userId}
	if err := a.DB.Insert(&session); err != nil {
		return nil, richErrors.Wrap(err, "user id:"+userId)
	}
	return &session, nil
}

func (a AuthStore) NewUser(email string, password string, name string, inviteCode string) (*User, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), BCryptCost)
	if err != nil {
		return nil, richErrors.Wrap(err, "Failed hashing password")
	}
	user := User{
		Id:       uuid.New().String(),
		Email:    email,
		Name:     name,
		Password: hashedPassword,
	}
	if err := a.DB.Insert(&user); err != nil {
		return nil, richErrors.Wrap(err, "email:"+email)
	}

	// TODO: This should be done in a transsaction
	// Create relation between user and associated school if use has invite code
	if inviteCode != "" {
		var school School
		// Search for school associated with invite code
		if err := a.DB.Model(&school).
			Where("invite_code=?", inviteCode).
			Select(); err != nil {
			return nil, richErrors.Wrap(err, "invite code:"+inviteCode)
		}

		userSchoolRelation := UserToSchool{school.Id, user.Id}
		if err := a.DB.Insert(&userSchoolRelation); err != nil {
			return nil, richErrors.Wrap(err, "invite code:"+inviteCode)
		}
	}
	return &user, nil
}

func (a AuthStore) GetSession(token string) (*Session, error) {
	var session Session
	if err := a.DB.Model(&session).
		Where("token=?", token).
		Select(); err != nil {
		return nil, richErrors.Wrap(err, "Failed getting session")
	}
	return &session, nil
}

func (a AuthStore) DeleteSession(token string) error {
	session := Session{Token: token}
	if err := a.DB.Delete(&session); err != nil {
		return richErrors.Wrap(err, "Failed deleting session")
	}
	return nil
}

func (a AuthStore) InsertNewToken(userId string) (*PasswordResetToken, error) {
	currentTime := time.Now()
	token := PasswordResetToken{
		Token:     uuid.New().String(),
		CreatedAt: currentTime,
		ExpiredAt: currentTime.Add(time.Hour),
		UserId:    userId,
	}
	if err := a.DB.Insert(&token); err != nil {
		return nil, richErrors.Wrap(err, "Failed inserting new token")
	}
	return &token, nil
}

func (a AuthStore) GetToken(token string) (*PasswordResetToken, error) {
	var result PasswordResetToken
	if err := a.DB.Model(&result).
		Where("token=?", token).
		Relation("User").
		Select(); err == pg.ErrNoRows {
		return nil, nil
	} else if err != nil {
		return nil, richErrors.Wrap(err, "Failed getting the token")
	}
	return &result, nil
}

func (a AuthStore) UpdatePassword(userId string, newPassword string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), BCryptCost)
	if err != nil {
		return richErrors.Wrap(err, "Failed hashing password")
	}
	user := User{Id: userId, Password: hashedPassword}
	if _, err := a.DB.Model(&user).
		Set("password = ?password").
		Where("id = ?id").
		Update(); err != nil {
		return richErrors.Wrap(err, "Failed updating user password")
	}
	return nil
}

func (a AuthStore) DeleteToken(token string) error {
	if _, err := a.DB.Model((*PasswordResetToken)(nil)).
		Where("token=?", token).
		Delete(); err != nil {
		return err
	}
	return nil
}

func (a AuthStore) ClearUserSession(userId string) error {
	if _, err := a.DB.Model((*Session)(nil)).
		Where("user_id=?", userId).
		Delete(); err != nil {
		return err
	}
	return nil
}
