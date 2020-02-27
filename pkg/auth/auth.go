package auth

import (
	"context"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
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
}

func NewMiddleware(s rest.Server, store postgres.AuthStore) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
			// Get session cookie
			cookie, err := r.Cookie("session")
			if err != nil {
				return &rest.Error{Code: http.StatusUnauthorized, Message: "Invalid session", Error: err}
			}

			// Get related session
			session, err := store.GetSession(cookie.Value)
			if err != nil {
				return &rest.Error{Code: http.StatusUnauthorized, Message: "Invalid session", Error: err}
			}

			// Attach session object to context for further use on other handlers
			ctx := context.WithValue(r.Context(), SessionCtxKey, session)
			next.ServeHTTP(w, r.WithContext(ctx))
			return nil
		})
	}
}

func GetSessionFromCtx(ctx context.Context) (*postgres.Session, bool) {
	session, ok := ctx.Value(SessionCtxKey).(*postgres.Session)
	return session, ok
}

func NewGetSessionError() *rest.Error {
	return &rest.Error{http.StatusUnauthorized, "Unauthorized", richErrors.New("session can't be found on context")}
}

func NewRouter(s rest.Server, store postgres.AuthStore, email MailService) *chi.Mux {
	server := server{s, store, email}
	r := chi.NewRouter()
	r.Method("POST", "/register", register(&server))
	r.Method("POST", "/login", login(&server))
	r.Method("POST", "/logout", logout(&server))
	r.Method("POST", "/reset-password", resetPassword(&server))
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
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		// TODO: add better mail validation
		email := r.FormValue("email")
		if email == "" {
			return &rest.Error{Code: http.StatusBadRequest, Message: "Email is required", Error: richErrors.New("mail is empty")}
		}

		// TODO: add better password validation
		password := r.FormValue("password")
		if password == "" {
			return &rest.Error{http.StatusBadRequest, "Password is required", richErrors.New("password is empty")}
		}

		user, err := s.store.GetUserByEmail(email)
		if err != nil {
			return &rest.Error{
				http.StatusInternalServerError,
				"Failed getting user data",
				err,
			}
		}
		if user == nil {
			return &rest.Error{
				http.StatusUnauthorized,
				"Wrong credentials",
				err,
			}
		}

		//  Compare hash and password
		err = bcrypt.CompareHashAndPassword(user.Password, []byte(password))
		if err != nil {
			return &rest.Error{Code: http.StatusBadRequest, Message: "Invalid mail or password", Error: err}
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
