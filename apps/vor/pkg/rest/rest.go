package rest

import (
	"fmt"
	"github.com/getsentry/sentry-go"
	"github.com/go-chi/chi/middleware"
	"go.uber.org/zap"
	"net/http"
	"os"
	"time"
)

type Error struct {
	// Status code of the http response
	Code int
	// Message to be shown to user
	Message string
	// Error to be reported to sentry/log
	Error error
}
type HandlerFunc func(http.ResponseWriter, *http.Request) *Error

type Handler struct {
	Logger  *zap.Logger
	Handler HandlerFunc
}

func (a Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// For centralized logging of Error
	if err := a.Handler(w, r); err != nil {
		reqID := middleware.GetReqID(r.Context())
		w.WriteHeader(err.Code)
		if err.Code == http.StatusUnauthorized {
			http.SetCookie(w, invalidateOldSessionCookie())
		}
		if err.Code >= http.StatusInternalServerError {
			// Server Error
			sentry.CaptureException(err.Error)
			msg := fmt.Sprintf("%s: %s", reqID, err.Message)
			a.Logger.Error(msg, zap.Error(err.Error))
			res := NewErrorJson("Something went wrong")
			_ = WriteJson(w, res)
		} else if err.Code >= http.StatusBadRequest {
			// User Error
			msg := fmt.Sprintf("%s: %s", reqID, err.Message)
			a.Logger.Warn(msg, zap.Error(err.Error))
			res := NewErrorJson(err.Message)
			_ = WriteJson(w, res)
		}
	}
}

type Server struct {
	logger *zap.Logger
}

func (s *Server) NewHandler(handler HandlerFunc) Handler {
	return Handler{s.logger, handler}
}

func NewServer(logger *zap.Logger) Server {
	return Server{logger}
}

// In the past, we don't set domain name for our cookie, this make browser
// automatically set cookie to "domain.tld" directly. Today we set the domain
// and it makes browser use ".domain.tld" which is a bit different from the old session.
//
// This is problematic (such as #51) because now when we set session cookie with the new
// method, user's browser who have logged in on older version would save 2 session cookie, "domain.tld"
// and ".domain.tld". And when the browser makes a request, to "domain.tld", it will include both session
// cookie. Which causes our API to read only the old cookie on "domain.tld" and returns 400.
//
// This function aims to remove the older cookie when user gets a 400
func invalidateOldSessionCookie() *http.Cookie {
	cookie := http.Cookie{
		Name:     "session",
		Value:    "",
		Path:     "/",
		Secure:   true,
		HttpOnly: true,
		MaxAge:   0,
		SameSite: http.SameSiteLaxMode,
		Expires:  time.Unix(0, 0),
	}

	if os.Getenv("env") != "production" {
		cookie.Secure = false
	}
	return &cookie
}
