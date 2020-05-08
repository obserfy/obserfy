package auth

import (
	"github.com/benbjohnson/clock"
	"github.com/go-chi/chi"
	"github.com/go-playground/validator/v10"
	richErrors "github.com/pkg/errors"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/chrsep/vor/pkg/rest"
)

const (
	SessionCtxKey = "session"
)

func NewRouter(s rest.Server, store Store, email MailService, clock clock.Clock) *chi.Mux {
	r := chi.NewRouter()
	r.Method("POST", "/register", register(s, store))
	r.Method("POST", "/login", login(s, store))
	r.Method("POST", "/logout", logout(s, store))
	r.Method("POST", "/mailPasswordReset", mailPasswordReset(s, store, email))
	r.Method("POST", "/doPasswordReset", doPasswordReset(s, store, email, clock))
	r.Method("GET", "/invite-code/{inviteCodeId}", resolveInviteCode(s, store))
	return r
}

func resolveInviteCode(server rest.Server, store Store) rest.Handler {
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		inviteCodeId := chi.URLParam(r, "inviteCodeId")

		schoolName, err := store.ResolveInviteCode(inviteCodeId)
		if err != nil {
			return &rest.Error{http.StatusNotFound, "Invite code not found", err}
		}

		if err := rest.WriteJson(w, schoolName); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func register(server rest.Server, store Store) rest.Handler {
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		// Validate
		// TODO: add better mail validation
		email := r.FormValue("email")
		if email == "" {
			return &rest.Error{Code: http.StatusBadRequest, Message: "Email field is required", Error: richErrors.New("email is empty")}
		}
		// TODO: add better password validation
		password := r.FormValue("password")
		if password == "" {
			return &rest.Error{http.StatusBadRequest, "Password is required", richErrors.New("mail is empty")}
		}

		// TODO: add better password validation
		name := r.FormValue("name")
		if name == "" {
			return &rest.Error{http.StatusInternalServerError, "Name is required", richErrors.New("name is empty ")}
		}
		inviteCode := r.FormValue("inviteCode")

		// Create new user
		user, err := store.NewUser(email, password, name, inviteCode)
		if err != nil {
			// TODO: Is there necessary?
			if strings.Contains(err.Error(), "#23505") {
				return &rest.Error{Code: http.StatusConflict, Message: "Email already been used", Error: err}
			}
			return &rest.Error{Code: http.StatusInternalServerError, Message: "Failed to insert user to db", Error: err}
		}

		// Create new session
		session, err := store.NewSession(user.Id)
		if err != nil {
			return &rest.Error{Code: http.StatusInternalServerError, Message: "Failed creating new session", Error: err}
		}

		// Send session token to client
		cookie := createCookie(session.Token)
		http.SetCookie(w, cookie)
		return nil
	})
}

func login(server rest.Server, store Store) rest.Handler {
	type requestBody struct {
		Password string `json:"password" validate:"required"`
		Email    string `json:"email" validate:"required,email"`
	}
	validate := validator.New()
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(
				richErrors.Wrap(err, "Failed parsing input"),
			)
		}

		// Validate input
		if err := validate.Struct(body); err != nil {
			return &rest.Error{
				http.StatusBadRequest,
				"Email and Password are required",
				richErrors.Wrap(err, "Invalid request body"),
			}
		}

		user, err := store.GetUserByEmail(body.Email)
		if err != nil {
			return &rest.Error{
				http.StatusInternalServerError,
				"Failed getting user data",
				richErrors.Wrap(err, "Failed querying user data"),
			}
		}
		if user == nil {
			return &rest.Error{
				http.StatusUnauthorized,
				"Invalid mail or password",
				richErrors.New("Can't find the given email owner"),
			}
		}

		//  Compare hash and password
		if err := bcrypt.CompareHashAndPassword(user.Password, []byte(body.Password)); err != nil {
			return &rest.Error{
				http.StatusUnauthorized,
				"Invalid mail or password",
				richErrors.Wrap(err, "Hash and password doesn't match."),
			}
		}

		// Create new session
		session, err := store.NewSession(user.Id)
		if err != nil {
			return &rest.Error{
				http.StatusInternalServerError,
				"Failed creating new session",
				err,
			}
		}

		// Send session token to client
		http.SetCookie(w, createCookie(session.Token))
		return nil
	})
}

func logout(server rest.Server, store Store) rest.Handler {
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		// Get cookie
		cookie, err := r.Cookie("session")
		if err != nil {
			return &rest.Error{Code: http.StatusUnauthorized, Message: "You're not logged in", Error: err}
		}

		// DeleteStudent session
		err = store.DeleteSession(cookie.Value)
		if err != nil {
			return &rest.Error{Code: http.StatusInternalServerError, Message: "Failed deleting session", Error: err}
		}
		return nil
	})
}

func createCookie(token string) *http.Cookie {
	cookie := http.Cookie{
		Name:     "session",
		Value:    token,
		Path:     "/",
		Expires:  time.Now().AddDate(1, 0, 0),
		Domain:   os.Getenv("SITE_URL"),
		Secure:   true,
		HttpOnly: true,
		MaxAge:   94608000,
		SameSite: http.SameSiteLaxMode,
	}
	if os.Getenv("env") != "production" {
		cookie.Secure = false
	}
	return &cookie
}
