package main

import (
	"encoding/json"
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
		ctx := r.Context()
		session, ok := ctx.Value(CTX_SESSION).(Session)
		if !ok {
			env.logger.Error("Failed to retrieve session")
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			return
		}

		var user User
		err := env.db.Model(&user).Column("email", "name").Where("id=?", session.UserId).Select()
		if err != nil {
			env.logger.Error("Failed getting user data", zap.Error(err))
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			return
		}

		res, err := json.Marshal(&struct {
			Email string
			Name  string
		}{
			Email: user.Email,
			Name:  user.Name,
		})
		if err != nil {
			env.logger.Error("Failed marshalling user data", zap.Error(err))
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			return
		}
		w.Header().Add("Content-Type", "application/json")
		_, err = w.Write(res)
		if err != nil {
			env.logger.Error("Fail writing response for getting user detail", zap.Error(err))
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			return
		}
	}
}

func getUserSchools(env Env) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		session, ok := ctx.Value(CTX_SESSION).(Session)
		if !ok {
			env.logger.Error("Failed to retrieve session")
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			return
		}

		var user User
		err := env.db.Model(&user).Where("id=?", session.UserId).Relation("Schools").Select()
		if err != nil {
			env.logger.Error("Failed getting user data", zap.Error(err))
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			return
		}

		res, err := json.Marshal(&user.Schools)
		if err != nil {
			env.logger.Error("Failed marshalling user data", zap.Error(err))
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			return
		}
		w.Header().Add("Content-Type", "application/json")
		if user.Schools == nil {
			_, err = w.Write([]byte("[]"))
		} else {
			_, err = w.Write(res)
		}
		if err != nil {
			env.logger.Error("Fail writing response for getting user detail", zap.Error(err))
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			return
		}
	}
}
