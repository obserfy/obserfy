package auth

import "time"

type (
	School struct {
		SchoolName string `json:"schoolName"`
	}

	User struct {
		Id       string `json:"id"`
		Email    string `json:"email"`
		Name     string `json:"name"`
		Password []byte `json:"password"`
	}

	Session struct {
		Token  string `json:"token"`
		UserId string `json:"userId"`
		//User   User   `json:"user"`
	}

	PasswordResetToken struct {
		Token     string    `json:"token"`
		UserId    string    `json:"userId"`
		CreatedAt time.Time `json:"createdAt"`
		ExpiredAt time.Time `json:"expiredAt"`
		User      User      `json:"user"`
	}

	Store interface {
		ResolveInviteCode(inviteCodeId string) (*School, error)
		GetUserByEmail(email string) (*User, error)
		NewSession(userId string) (*Session, error)
		NewUser(email string, password string, name string, inviteCode string) (*User, error)
		GetSession(token string) (*Session, error)
		DeleteSession(token string) error
		NewPasswordResetToken(userId string) (*PasswordResetToken, error)
		GetPasswordResetToken(token string) (*PasswordResetToken, error)
		DoPasswordReset(userId string, newPassword string, token string) error
	}

	MailService interface {
		SendResetPassword(email string, token string) error
		SendPasswordResetSuccessful(email string) error
	}
)
