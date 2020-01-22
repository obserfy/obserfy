package main

import (
	"context"
	"errors"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"github.com/go-pg/pg/v9"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"os"
	"strings"
	"time"
)

const SessionCtxKey = "session"

func createAuthSubroute(env Env) *chi.Mux {
	r := chi.NewRouter()
	r.Method("POST", "/register", register(env))
	r.Method("POST", "/login", login(env))
	r.Method("POST", "/logout", logout(env))
	r.Method("GET", "/invite-code/{inviteCodeId}", getInviteCodeInformation(env))
	return r
}

func getInviteCodeInformation(env Env) rest.Handler {
	type response struct {
		SchoolName string `json:"schoolName"`
	}
	return rest.Handler{Logger: env.logger, Handler: func(w http.ResponseWriter, r *http.Request) *rest.Error {
		inviteCodeId := chi.URLParam(r, "inviteCodeId")

		var school postgres.School
		if err := env.db.Model(&school).
			Where("invite_code=?", inviteCodeId).
			Select(); err != nil {
			return &rest.Error{http.StatusNotFound, "Invite code not found", err}
		}

		res := response{school.Name}
		if err := rest.WriteJson(w, res); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	}}
}

func register(env Env) rest.Handler {
	return rest.Handler{Logger: env.logger, Handler: func(w http.ResponseWriter, r *http.Request) *rest.Error {
		id := uuid.New()

		// TODO: add better email validation
		email := r.FormValue("email")
		if email == "" {
			return &rest.Error{http.StatusBadRequest, "Email is required", errors.New("email is empty")}
		}

		// TODO: add better password validation
		password := r.FormValue("password")
		if password == "" {
			return &rest.Error{http.StatusBadRequest, "Password is required", errors.New("email is empty")}
		}
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), BCryptCost)
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed to hash password", err}
		}

		// TODO: add better password validation
		name := r.FormValue("name")
		if name == "" {
			return &rest.Error{http.StatusInternalServerError, "Name is required", errors.New("name is empty ")}
		}

		user := postgres.User{
			Id:       id.String(),
			Email:    email,
			Name:     name,
			Password: hashedPassword,
		}
		err = env.db.Insert(&user)
		if err != nil {
			// TODO: Is there necessary?
			if strings.Contains(err.Error(), "#23505") {
				return &rest.Error{http.StatusConflict, "Email already been used", err}
			}
			return &rest.Error{http.StatusInternalServerError, "Failed to insert user to db", err}
		}

		// Create relation between user and associated school if use has invite code
		inviteCode := r.FormValue("inviteCode")
		if inviteCode != "" {
			var school postgres.School
			// Search for school associated with invite code
			if err := env.db.Model(&school).
				Where("invite_code=?", inviteCode).
				Select(); err != nil {
				return &rest.Error{http.StatusNotFound, "Invitation code is invalid", err}
			}

			userSchoolRelation := postgres.UserToSchool{
				SchoolId: school.Id,
				UserId:   user.Id,
			}
			err = env.db.Insert(&userSchoolRelation)
			if err != nil {
				return &rest.Error{http.StatusInternalServerError, "Failed to insert user to db", err}
			}
		}

		cookie, err := createAndSaveSessionCookie(env.db, user.Id)
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Fail saving session", err}
		}
		http.SetCookie(w, cookie)
		return nil
	}}
}

func login(env Env) rest.Handler {
	return rest.Handler{Logger: env.logger, Handler: func(w http.ResponseWriter, r *http.Request) *rest.Error {
		// TODO: add better email validation
		email := r.FormValue("email")
		if email == "" {
			return &rest.Error{http.StatusBadRequest, "Email is required", errors.New("email is empty")}
		}

		// TODO: add better password validation
		password := r.FormValue("password")
		if password == "" {
			return &rest.Error{http.StatusBadRequest, "Password is required", errors.New("password is empty")}
		}

		var user postgres.User
		if err := env.db.Model(&user).
			Where("email=?", email).
			First(); err != nil {
			return &rest.Error{http.StatusBadRequest, "Invalid email or password", err}
		}
		if err := bcrypt.CompareHashAndPassword(user.Password, []byte(password)); err != nil {
			return &rest.Error{http.StatusBadRequest, "Invalid email or password", err}
		}

		cookie, err := createAndSaveSessionCookie(env.db, user.Id)
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Fail saving session", err}
		}
		http.SetCookie(w, cookie)
		return nil
	}}
}

func logout(env Env) rest.Handler {
	return rest.Handler{Logger: env.logger, Handler: func(w http.ResponseWriter, r *http.Request) *rest.Error {
		tokenCookie, err := r.Cookie("session")
		if err != nil {
			return &rest.Error{http.StatusUnauthorized, "You're not logged in", err}
		}

		session := postgres.Session{Token: tokenCookie.Value}
		if err = env.db.Delete(&session); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed deleting session", err}
		}
		return nil
	}}
}

func createAuthMiddleware(env Env) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return rest.Handler{Logger: env.logger, Handler: func(w http.ResponseWriter, r *http.Request) *rest.Error {
			token, err := r.Cookie("session")
			if err != nil {
				return &rest.Error{http.StatusUnauthorized, "Invalid session", err}
			}

			var session postgres.Session
			if err = env.db.Model(&session).
				Where("token=?", token.Value).
				Select(); err != nil {
				return &rest.Error{http.StatusUnauthorized, "Invalid session", err}
			}

			ctx := context.WithValue(r.Context(), SessionCtxKey, session)
			next.ServeHTTP(w, r.WithContext(ctx))
			return nil
		}}
	}
}

func getSessionFromCtx(ctx context.Context) (postgres.Session, bool) {
	session, ok := ctx.Value(SessionCtxKey).(postgres.Session)
	return session, ok
}

func createGetSessionError() *rest.Error {
	return &rest.Error{http.StatusUnauthorized, "Unauthorized", errors.New("session can't be found on context")}
}

func createAndSaveSessionCookie(db *pg.DB, userId string) (*http.Cookie, error) {
	session := postgres.Session{
		Token:  uuid.New().String(),
		UserId: userId,
	}
	if err := db.Insert(&session); err != nil {
		return nil, err
	}

	var cookie http.Cookie
	if os.Getenv("env") == "production" {
		cookie = http.Cookie{
			Name:     "session",
			Value:    session.Token,
			Path:     "/",
			Expires:  time.Now().AddDate(1, 0, 0),
			Domain:   os.Getenv("SITE_URL"),
			Secure:   true,
			HttpOnly: true,
			MaxAge:   94608000,
			SameSite: http.SameSiteLaxMode,
		}
	} else {
		cookie = http.Cookie{
			Name:     "session",
			Value:    session.Token,
			Path:     "/",
			Expires:  time.Now().AddDate(1, 0, 0),
			Secure:   false,
			HttpOnly: true,
			MaxAge:   94608000,
			SameSite: http.SameSiteLaxMode,
		}
	}
	return &cookie, nil
}
