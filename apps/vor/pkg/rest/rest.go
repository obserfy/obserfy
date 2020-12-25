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

func (s *Server) NewHandler(handler HandlerFunc) Handler {
	return Handler{s.logger, handler}
}

func NewServer(logger *zap.Logger) Server {
	return Server{logger}
}

// Server object that encapsulates global data
type Server struct {
	logger *zap.Logger
}

// Handler that wraps around every api handler, providing common functionality such writing error and logging logging.
type HandlerFunc func(http.ResponseWriter, *http.Request) *Error
type Handler struct {
	Logger  *zap.Logger
	Handler HandlerFunc
}

func (h Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// For centralized logging of Error
	if err := h.Handler(w, r); err != nil {
		reqID := middleware.GetReqID(r.Context())
		// clear cookies when user is not authorized
		if err.Code == http.StatusUnauthorized {
			http.SetCookie(w, invalidateOldSessionCookie())
		}

		// Check and log what type the error is
		msg := fmt.Sprintf("%s: %s", reqID, err.Message)
		var res errorResponse
		if err.Code >= http.StatusInternalServerError {
			// Server Error
			h.Logger.Error(msg, zap.Error(err.Error))
			sentry.CaptureException(err.Error)
			res = newErrorResponse("Something went wrong")
		} else if err.Code >= http.StatusBadRequest {
			// User Error
			h.Logger.Warn(msg, zap.Error(err.Error))
			res = newErrorResponse(err.Message)
		}

		w.WriteHeader(err.Code)
		if err := WriteJson(w, res); err != nil {
			h.Logger.Error("failed to write error response", zap.Error(err))
		}
	}
}

// Json object returned when the server encounters an error
func newErrorResponse(message string) errorResponse {
	return errorResponse{errorDetails{Message: message}}
}

type errorResponse struct {
	Error errorDetails `json:"error"`
}

type errorDetails struct {
	Message string `json:"message"`
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
