package main

import (
	"context"
	"github.com/volatiletech/authboss"
	"github.com/volatiletech/authboss/defaults"
	"go.uber.org/zap"
	"net/http"
	"os"
)

func setupAuthboss(authUrl string, env Env) (*authboss.Authboss, http.Handler) {
	ab := authboss.New()
	ab.Config.Paths.Mount = authUrl
	ab.Config.Paths.RootURL = os.Getenv("SITE_URL")
	ab.Config.Storage.Server = &PostgresStorer{}
	defaults.SetCore(&ab.Config, true, false)
	if err := ab.Init(); err != nil {
		env.logger.Error("Authboss error", zap.Error(err))
	}
	//return ab.Config.Core.Router
	return ab, http.StripPrefix(authUrl, ab.Config.Core.Router)
}

type User struct {
	authboss.User
	Id       string `json:"id" pg:",type:uuid"`
	Email    string
	Password string
}

func (user *User) GetPID() string {
	return user.Email
}

func (user *User) PutPID(id string) {
	user.Email = id
}

type PostgresStorer struct {
	authboss.ServerStorer
	authboss.CreatingServerStorer
	env Env
}

func (storer PostgresStorer) Load(ctx context.Context, key string) (authboss.User, error) {
	var user User
	err := storer.env.db.Model(&user).Where("id = ?", key).Select()
	if err != nil {
		storer.env.logger.Error("Error querying user", zap.Error(err))
	}
	return &user, err
}

func (storer PostgresStorer) Save(ctx context.Context, user authboss.User) error {
	var userToSave User
	userToSave.PutPID(user.GetPID())
	err := storer.env.db.Insert(&user)
	if err != nil {
		storer.env.logger.Error("Error saving auth user", zap.Error(err))
	}
	return err
}

func (storer PostgresStorer) New(ctx context.Context) authboss.User {
	return &User{}
}

func (storer PostgresStorer) Create(ctx context.Context, user authboss.User) error {
	var existingUser User
	err := storer.env.db.Model(&existingUser).Where("email=?", user.GetPID()).Select()
	if err != nil {
		storer.env.logger.Error("Failed creating user", zap.Error(err))
	}
	return err
}
