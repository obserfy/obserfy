package main

import (
	"context"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"os"
)

const CTX_SESSION = "session"

type Session struct {
	Token  string `pg:",pk" pg:",type:uuid"`
	UserId string
}

func createAuthSubroute(env Env) *chi.Mux {
	r := chi.NewRouter()
	r.Post("/register", register(env))
	r.Post("/login", login(env))
	r.Post("/logout", logout(env))
	return r
}

func register(env Env) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id, err := uuid.NewRandom()
		if err != nil {
			env.logger.Error("Failed to generate new uuid", zap.Error(err))
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

		// TODO: add better email validation
		email := r.FormValue("email")
		if email == "" {
			http.Error(w, "Email is required", http.StatusBadRequest)
			return
		}

		// TODO: add better password validation
		password := r.FormValue("password")
		if password == "" {
			http.Error(w, "Password is required", http.StatusBadRequest)
			return
		}
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), BCryptCost)
		if err != nil {
			env.logger.Error("Failed to hash password", zap.Error(err))
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

		requestBody := User{
			Id:       id.String(),
			Email:    email,
			Password: hashedPassword,
		}

		err = env.db.Insert(&requestBody)
		if err != nil {
			env.logger.Error("Failed to insert to db", zap.Error(err))
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	}
}

func login(env Env) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		// TODO: add better email validation
		email := r.FormValue("email")
		if email == "" {
			http.Error(w, "Email is required", http.StatusBadRequest)
			return
		}

		// TODO: add better password validation
		password := r.FormValue("password")
		if password == "" {
			http.Error(w, "Password is required", http.StatusBadRequest)
			return
		}

		var user User
		err := env.db.Model(&user).Where("email=?", email).First()
		if err != nil {
			http.Error(w, "Invalid Credential", http.StatusUnauthorized)
			return
		}
		err = bcrypt.CompareHashAndPassword(user.Password, []byte(password))
		if err != nil {
			http.Error(w, "Invalid Credential", http.StatusUnauthorized)
			return
		}

		token, err := uuid.NewRandom()
		if err != nil {
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			env.logger.Error("Failed creating token", zap.Error(err))
			return
		}
		session := Session{
			Token:  token.String(),
			UserId: user.Id,
		}
		err = env.db.Insert(&session)
		if err != nil {
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			env.logger.Error("Failed saving token to db", zap.Error(err))
			return
		}

		// TODO: Confirm cookie is correctly created
		cookie := http.Cookie{
			Name:   "session",
			Value:  session.Token,
			Path:   "/",
			Domain: os.Getenv("SITE_URL"),
			Secure: true,
		}
		http.SetCookie(w, &cookie)
	}
}

func logout(env Env) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		tokenCookie, err := r.Cookie("session")
		if err != nil {
			env.logger.Error("Error getting session cookie", zap.Error(err))
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		session := Session{Token: tokenCookie.Value}
		err = env.db.Delete(&session)
		if err != nil {
			env.logger.Error("Error removing session", zap.Error(err))
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
		}
	}
}

func createAuthMiddleware(env Env) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		fn := func(w http.ResponseWriter, r *http.Request) {
			token, err := r.Cookie("session")
			if err != nil {
				env.logger.Error("Error getting session cookie", zap.Error(err))
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			var session Session
			err = env.db.Model(&session).Where("token=?", token.Value).Select()
			if err != nil {
				env.logger.Error("Error querying session", zap.Error(err))
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), CTX_SESSION, session)
			next.ServeHTTP(w, r.WithContext(ctx))
		}
		return http.HandlerFunc(fn)
	}
}

func getSessionFromCtx(w http.ResponseWriter, r *http.Request, logger *zap.Logger) (Session, bool) {
	ctx := r.Context()
	session, ok := ctx.Value(CTX_SESSION).(Session)
	if !ok {
		logger.Error("Failed to retrieve session")
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
	}
	return session, ok
}
