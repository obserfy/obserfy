package postgres

import (
	"github.com/go-pg/pg/v10"
	"github.com/google/uuid"
	richErrors "github.com/pkg/errors"
	"golang.org/x/crypto/bcrypt"
	"time"

	"github.com/chrsep/vor/pkg/auth"
)

const (
	BCryptCost = 10
)

type AuthStore struct {
	DB *pg.DB
}

func (a AuthStore) ResolveInviteCode(inviteCodeId string) (*auth.School, error) {
	var school School
	if err := a.DB.Model(&school).
		Where("invite_code=?", inviteCodeId).
		Select(); err != nil {
		return nil, richErrors.Wrap(err, "invite code:"+inviteCodeId)
	}

	return &auth.School{
		SchoolName: school.Name,
	}, nil
}

func (a AuthStore) GetUserByEmail(email string) (*auth.User, error) {
	var user User
	if err := a.DB.Model(&user).
		Where("email=?", email).
		First(); err == pg.ErrNoRows {
		return nil, nil
	} else if err != nil {
		return nil, richErrors.Wrap(err, "email: "+email)
	}
	return &auth.User{
		Id:       user.Id,
		Email:    user.Email,
		Name:     user.Name,
		Password: user.Password,
	}, nil
}

func (a AuthStore) NewSession(userId string) (*auth.Session, error) {
	session := Session{uuid.New().String(), userId}
	if err := a.DB.Insert(&session); err != nil {
		return nil, richErrors.Wrap(err, "user id:"+userId)
	}
	return &auth.Session{
		Token:  session.Token,
		UserId: session.UserId,
	}, nil
}

func (a AuthStore) NewUser(email string, password string, name string, inviteCode string) (*auth.User, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), BCryptCost)
	if err != nil {
		return nil, richErrors.Wrap(err, "Failed hashing password")
	}
	userId := uuid.New().String()
	user := User{
		Id:       userId,
		Email:    email,
		Name:     name,
		Password: hashedPassword,
	}
	if err := a.DB.Insert(&user); err != nil {
		return nil, richErrors.Wrap(err, "email:"+email)
	}

	// TODO: This should be done in a transaction
	// Create relation between user and associated school if use has invite code
	if inviteCode != "" {
		var school School
		// Search for school associated with invite code
		if err := a.DB.Model(&school).
			Where("invite_code=?", inviteCode).
			Select(); err != nil {
			return nil, richErrors.Wrap(err, "invite code:"+inviteCode)
		}

		userSchoolRelation := UserToSchool{SchoolId: school.Id, UserId: user.Id}
		if err := a.DB.Insert(&userSchoolRelation); err != nil {
			return nil, richErrors.Wrap(err, "invite code:"+inviteCode)
		}
	}
	return &auth.User{
		Id:    userId,
		Email: email,
		Name:  name,
	}, nil
}

func (a AuthStore) GetSession(token string) (*auth.Session, error) {
	var session Session
	if err := a.DB.Model(&session).
		Where("token=?", token).
		Select(); err != nil {
		return nil, richErrors.Wrap(err, "Failed getting session")
	}
	return &auth.Session{
		Token:  session.Token,
		UserId: session.UserId,
	}, nil
}

func (a AuthStore) DeleteSession(token string) error {
	session := Session{Token: token}
	if err := a.DB.Delete(&session); err != nil {
		return richErrors.Wrap(err, "Failed deleting session")
	}
	return nil
}

func (a AuthStore) NewPasswordResetToken(userId string) (*auth.PasswordResetToken, error) {
	currentTime := time.Now()
	expiredAt := currentTime.Add(time.Hour)
	newToken := uuid.New().String()
	token := PasswordResetToken{
		Token:     newToken,
		CreatedAt: currentTime,
		ExpiredAt: expiredAt,
		UserId:    userId,
	}
	if err := a.DB.Insert(&token); err != nil {
		return nil, richErrors.Wrap(err, "Failed inserting new token")
	}
	return &auth.PasswordResetToken{
		Token:     newToken,
		UserId:    userId,
		ExpiredAt: expiredAt,
	}, nil
}

func (a AuthStore) GetPasswordResetToken(token string) (*auth.PasswordResetToken, error) {
	var result PasswordResetToken
	if err := a.DB.Model(&result).
		Where("token=?", token).
		Relation("User").
		Select(); err == pg.ErrNoRows {
		return nil, nil
	} else if err != nil {
		return nil, richErrors.Wrap(err, "Failed getting the token")
	}
	return &auth.PasswordResetToken{
		Token:     result.Token,
		UserId:    result.UserId,
		CreatedAt: result.CreatedAt,
		ExpiredAt: result.ExpiredAt,
		User: auth.User{
			Id:    result.User.Id,
			Email: result.User.Email,
			Name:  result.User.Name,
		},
	}, nil
}

func (a AuthStore) DoPasswordReset(userId string, newPassword string, token string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), BCryptCost)
	if err != nil {
		return richErrors.Wrap(err, "Failed hashing password")
	}

	user := User{Id: userId, Password: hashedPassword}
	if err := a.DB.RunInTransaction(func(tx *pg.Tx) error {
		// Delete the token being used
		if _, err := a.DB.Model((*PasswordResetToken)(nil)).
			Where("token=?", token).
			Delete(); err != nil {
			return richErrors.Wrap(err, "Failed to delete token")
		}

		// Delete all user sessions
		if _, err := a.DB.Model((*Session)(nil)).
			Where("user_id=?", userId).
			Delete(); err != nil {
			return richErrors.Wrap(err, "Failed to delete Sessions")
		}

		// Update user's password
		if _, err := a.DB.Model(&user).
			Set("password = ?password").
			Where("id = ?id").
			Update(); err != nil {
			return richErrors.Wrap(err, "Failed updating user password")
		}

		return nil
	}); err != nil {
		return err
	}

	return nil
}
