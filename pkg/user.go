package main

import (
	"github.com/go-chi/chi"
	"go.uber.org/zap"
	"net/http"
)

type User struct {
	Id       string `json:"id" pg:",type:uuid"`
	Email    string
	Name     string
	Password []byte
	Schools  []School `pg:"many2many:user_to_schools,joinFK:school_id"`
}

func createUserSubroute(env Env) *chi.Mux {
	r := chi.NewRouter()
	r.Get("/", getUserDetails(env))
	r.Get("/schools", getUserSchools(env))
	return r
}

func getUserDetails(env Env) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		session, ok := getSessionFromCtx(w, r, env.logger)
		if !ok {
			return
		}

		var user User
		err := env.db.Model(&user).Column("email", "name").Where("id=?", session.UserId).Select()
		if err != nil {
			env.logger.Error("Failed getting user data", zap.Error(err))
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			return
		}

		err = writeJsonResponse(w, &struct {
			Email string
			Name  string
		}{
			Email: user.Email,
			Name:  user.Name,
		}, env.logger)
	}
}

func getUserSchools(env Env) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		session, ok := getSessionFromCtx(w, r, env.logger)
		if !ok {
			return
		}

		var user User
		err := env.db.Model(&user).Where("id=?", session.UserId).Relation("Schools").Select()
		if err != nil {
			env.logger.Error("Failed getting user data", zap.Error(err))
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			return
		}

		err = writeJsonResponse(w, &user.Schools, env.logger)
	}
}
