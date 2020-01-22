package main

import (
	"errors"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"net/http"
)

func createUserSubroute(env Env) *chi.Mux {
	r := chi.NewRouter()
	r.Method("GET", "/", getUserDetails(env))
	r.Method("GET", "/schools", getUserSchools(env))
	return r
}

func getUserDetails(env Env) rest.Handler {
	type response struct {
		Id    string `json:"id"`
		Email string `json:"email"`
		Name  string `json:"name"`
	}
	return rest.Handler{Logger: env.logger, Handler: func(w http.ResponseWriter, r *http.Request) *rest.Error {
		session, ok := getSessionFromCtx(r.Context())
		if !ok {
			return &rest.Error{http.StatusUnauthorized, "Invalid session", errors.New("can't get session from context")}
		}

		var user postgres.User
		if err := env.db.Model(&user).
			Column("id", "email", "name").
			Where("id=?", session.UserId).
			Select(); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Can't get user data", err}
		}

		if err := rest.WriteJson(w, response{
			Id:    user.Id,
			Email: user.Email,
			Name:  user.Name,
		}); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	}}
}

func getUserSchools(env Env) rest.Handler {
	return rest.Handler{Logger: env.logger, Handler: func(w http.ResponseWriter, r *http.Request) *rest.Error {
		session, ok := getSessionFromCtx(r.Context())
		if !ok {
			return &rest.Error{http.StatusUnauthorized, "Invalid session", errors.New("can't get session from context")}
		}

		var user postgres.User
		if err := env.db.Model(&user).
			Where("id=?", session.UserId).
			Relation("Schools").
			Select(); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Can't get user data", err}
		}

		// TODO: Don't return SQL objects
		if err := rest.WriteJson(w, &user.Schools); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	}}
}
