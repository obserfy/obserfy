package main

import (
	"errors"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/go-chi/chi"
	"net/http"
)

func createUserSubroute(env Env) *chi.Mux {
	r := chi.NewRouter()
	r.Method("GET", "/", getUserDetails(env))
	r.Method("GET", "/schools", getUserSchools(env))
	return r
}

func getUserDetails(env Env) AppHandler {
	type response struct {
		Id    string `json:"id"`
		Email string `json:"email"`
		Name  string `json:"name"`
	}
	return AppHandler{env, func(w http.ResponseWriter, r *http.Request) *HTTPError {
		session, ok := getSessionFromCtx(r.Context())
		if !ok {
			return &HTTPError{http.StatusUnauthorized, "Invalid session", errors.New("can't get session from context")}
		}

		var user postgres.User
		if err := env.db.Model(&user).
			Column("id", "email", "name").
			Where("id=?", session.UserId).
			Select(); err != nil {
			return &HTTPError{http.StatusInternalServerError, "Can't get user data", err}
		}

		if err := writeJson(w, response{
			Id:    user.Id,
			Email: user.Email,
			Name:  user.Name,
		}); err != nil {
			return createWriteJsonError(err)
		}
		return nil
	}}
}

func getUserSchools(env Env) AppHandler {
	return AppHandler{env, func(w http.ResponseWriter, r *http.Request) *HTTPError {
		session, ok := getSessionFromCtx(r.Context())
		if !ok {
			return &HTTPError{http.StatusUnauthorized, "Invalid session", errors.New("can't get session from context")}
		}

		var user postgres.User
		if err := env.db.Model(&user).
			Where("id=?", session.UserId).
			Relation("Schools").
			Select(); err != nil {
			return &HTTPError{http.StatusInternalServerError, "Can't get user data", err}
		}

		// TODO: Don't return SQL objects
		if err := writeJson(w, &user.Schools); err != nil {
			return createWriteJsonError(err)
		}
		return nil
	}}
}
