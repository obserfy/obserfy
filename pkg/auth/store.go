package auth

import "time"

type (
	School struct {
		SchoolName string `json:"school_name"`
	}

	User struct {
		Id       string `json:"id"`
		Email    string `json:"email"`
		Name     string `json:"name"`
		Password []byte `json:"password"`
	}

	SessionData struct {
		Token     string    `json:"token"`
		UserId    string    `json:"user_id"`
		CreatedAt time.Time `json:"created_at"`
		ExpiredAt time.Time `json:"expired_at"`
		User      User      `json:"user"`
	}

	Store interface {
		ResolveInviteCode(inviteCodeId string) (*School, error)
		GetUserByEmail(email string) (*User, error)
		NewSession(userId string) (*SessionData, error)
		NewUser(email string, password string, name string, inviteCode string) (*User, error)
		GetSession(token string) (*SessionData, error)
		DeleteSession(token string) error
		InsertNewToken(userId string) (*SessionData, error)
		GetToken(token string) (*SessionData, error)
		DoPasswordReset(userId string, newPassword string, token string) error
	}

	MailService interface {
		SendResetPassword(email string, token string) error
		SendPasswordResetSuccessful(email string) error
	}
)