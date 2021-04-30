package rest

import (
	"go.uber.org/zap"
	"net/http"
	"os"
	"time"
)

func NewServer(logger *zap.Logger) Server {
	return Server{logger}
}

// Server object that encapsulates global data
type Server struct {
	Log *zap.Logger
}

type errorResponse struct {
	Error errorDetails `json:"error"`
}

type errorDetails struct {
	Message string `json:"message"`
}

// Json object returned when the server encounters an error
func newErrorResponse(message string) errorResponse {
	return errorResponse{errorDetails{Message: message}}
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
