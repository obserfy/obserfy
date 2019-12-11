package main

import (
	"context"
	"github.com/go-chi/chi"
	"github.com/go-pg/pg/v9"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"os"
	"strings"
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
	r.Get("/invite-code/{inviteCodeId}", getInviteCodeInformation(env))
	return r
}

func getInviteCodeInformation(env Env) http.HandlerFunc {
	type response struct {
		SchoolName string `json:"schoolName"`
	}
	return func(w http.ResponseWriter, r *http.Request) {
		inviteCodeId := chi.URLParam(r, "inviteCodeId")
		var school School
		err := env.db.Model(&school).Where("invite_code=?", inviteCodeId).Select()
		if err != nil {
			http.NotFound(w, r)
			return
		}
		response := response{
			SchoolName: school.Name,
		}
		_ = writeJsonResponse(w, response, env.logger)
	}
}

func register(env Env) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id, err := uuid.NewRandom()
		if err != nil {
			env.logger.Error("Failed to generate new uuid", zap.Error(err))
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// TODO: add better email validation
		email := r.FormValue("email")
		if email == "" {
			env.logger.Info("Failed to hash password")
			http.Error(w, "Email is required", http.StatusBadRequest)
			return
		}

		// TODO: add better password validation
		password := r.FormValue("password")
		if password == "" {
			env.logger.Info("Failed to hash password")
			http.Error(w, "Password is required", http.StatusBadRequest)
			return
		}
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), BCryptCost)
		if err != nil {
			env.logger.Info("Failed to hash password", zap.Error(err))
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			return
		}

		// TODO: add better password validation
		name := r.FormValue("name")
		if name == "" {
			env.logger.Info("Failed to hash password")
			http.Error(w, "Name is required", http.StatusBadRequest)
			return
		}

		// Validate invite code if exists
		inviteCode := r.FormValue("inviteCode")
		var school School
		if inviteCode != "" {
			_, err := uuid.Parse(inviteCode)
			if err != nil {
				http.Error(w, "Invalid invite code", http.StatusBadRequest)
				env.logger.Info("Invalid invite code", zap.String("inviteCode", inviteCode))
				return
			}

			// Search for school associated with invite code
			err = env.db.Model(&school).Where("invite_code=?", inviteCode).Select()
			if err == pg.ErrNoRows {
				env.logger.Warn("Cannot find invitation code school info", zap.String("invitation code", inviteCode))
				http.Error(w, "Invitation code owner not found", http.StatusNotFound)
				return
			}
			if err != nil {
				writeInternalServerError("Failed getting school data", w, err, env.logger)
				return
			}

		}

		user := User{
			Id:       id.String(),
			Email:    email,
			Name:     name,
			Password: hashedPassword,
		}
		err = env.db.Insert(&user)
		if err != nil {
			if strings.Contains(err.Error(), "#23505") {
				http.Error(w, "This email has already been used", http.StatusConflict)
				env.logger.Info("Someone tries to login with existing email", zap.String("email", email))
				return
			}
			env.logger.Error("Failed to insert to db", zap.Error(err))
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			return
		}

		if inviteCode != "" {
			// Create relation between user and associated school
			userSchoolRelation := UserToSchool{
				SchoolId: school.Id,
				UserId:   user.Id,
			}
			err = env.db.Insert(&userSchoolRelation)
			if err != nil {
				writeInternalServerError("Failed saving user relation to school", w, err, env.logger)
				return
			}
		}

		giveNewSession(w, env, user.Id)
	}
}

func login(env Env) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		// TODO: add better email validation
		email := r.FormValue("email")
		if email == "" {
			env.logger.Info("Failed to hash password")
			http.Error(w, "Email is required", http.StatusBadRequest)
			return
		}

		// TODO: add better password validation
		password := r.FormValue("password")
		if password == "" {
			env.logger.Info("Failed to hash password")
			http.Error(w, "Password is required", http.StatusBadRequest)
			return
		}

		var user User
		err := env.db.Model(&user).Where("email=?", email).First()
		if err != nil {
			env.logger.Info("Failed to hash password", zap.Error(err))
			http.Error(w, "Invalid Credential", http.StatusUnauthorized)
			return
		}
		err = bcrypt.CompareHashAndPassword(user.Password, []byte(password))
		if err != nil {
			env.logger.Info("Failed to hash password", zap.Error(err))
			http.Error(w, "Invalid Credential", http.StatusUnauthorized)
			return
		}

		giveNewSession(w, env, user.Id)
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

func giveNewSession(w http.ResponseWriter, env Env, userId string) {
	token, err := uuid.NewRandom()
	if err != nil {
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		env.logger.Error("Failed creating token", zap.Error(err))
		return
	}
	session := Session{
		Token:  token.String(),
		UserId: userId,
	}
	err = env.db.Insert(&session)
	if err != nil {
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		env.logger.Error("Failed saving token to db", zap.Error(err))
		return
	}

	// TODO: Confirm cookie is correctly created
	cookie := http.Cookie{
		Name:     "session",
		Value:    session.Token,
		Path:     "/",
		Domain:   os.Getenv("SITE_URL"),
		Secure:   true,
		HttpOnly: true,
		MaxAge:   94608000,
		SameSite: http.SameSiteLaxMode,
	}
	http.SetCookie(w, &cookie)
}
