package auth

import (
	"github.com/benbjohnson/clock"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"github.com/go-playground/validator/v10"
	richErrors "github.com/pkg/errors"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"os"
	"strings"
	"time"
)

const (
	SessionCtxKey = "session"
)

type MailService interface {
	SendResetPassword(email string, token string) error
}

type server struct {
	rest.Server
	store postgres.AuthStore
	mail  MailService
	// Used for mocking time during test
	clock clock.Clock
}

func NewRouter(s rest.Server, store postgres.AuthStore, email MailService, clock clock.Clock) *chi.Mux {
	server := server{s, store, email, clock}
	r := chi.NewRouter()
	r.Method("POST", "/register", register(&server))
	r.Method("POST", "/login", login(&server))
	r.Method("POST", "/logout", logout(&server))
	r.Method("POST", "/mailPasswordReset", mailPasswordReset(&server))
	r.Method("POST", "/doPasswordReset", doPasswordReset(&server))
	r.Method("GET", "/invite-code/{inviteCodeId}", resolveInviteCode(&server))
	return r
}

func resolveInviteCode(s *server) rest.Handler {
	type response struct {
		SchoolName string `json:"schoolName"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		inviteCodeId := chi.URLParam(r, "inviteCodeId")

		school, err := s.store.ResolveInviteCode(inviteCodeId)
		if err != nil {
			return &rest.Error{http.StatusNotFound, "Invite code not found", err}
		}

		res := response{school.Name}
		if err := rest.WriteJson(w, res); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func register(s *server) rest.Handler {
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
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
		user, err := s.store.NewUser(email, password, name, inviteCode)
		if err != nil {
			// TODO: Is there necessary?
			if strings.Contains(err.Error(), "#23505") {
				return &rest.Error{Code: http.StatusConflict, Message: "Email already been used", Error: err}
			}
			return &rest.Error{Code: http.StatusInternalServerError, Message: "Failed to insert user to db", Error: err}
		}

		// Create new session
		session, err := s.store.NewSession(user.Id)
		if err != nil {
			return &rest.Error{Code: http.StatusInternalServerError, Message: "Failed creating new session", Error: err}
		}

		// Send session token to client
		cookie := createCookie(session.Token)
		http.SetCookie(w, cookie)
		return nil
	})
}

func login(s *server) rest.Handler {
	type requestBody struct {
		Password string `json:"password" validate:"required"`
		Email    string `json:"email" validate:"required,email"`
	}
	validate := validator.New()
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
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

		user, err := s.store.GetUserByEmail(body.Email)
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
		session, err := s.store.NewSession(user.Id)
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

func logout(s *server) rest.Handler {
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		// Get cookie
		cookie, err := r.Cookie("session")
		if err != nil {
			return &rest.Error{Code: http.StatusUnauthorized, Message: "You're not logged in", Error: err}
		}

		// Delete session
		err = s.store.DeleteSession(cookie.Value)
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
