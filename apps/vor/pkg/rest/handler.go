package rest

import (
	"fmt"
	"github.com/getsentry/sentry-go"
	"github.com/go-chi/chi/middleware"
	"go.uber.org/zap"
	"net/http"
)

// Deprecated: Prefer to use JsonHandler
func (s *Server) NewHandler(handler HandlerFunc) Handler {
	return Handler{s.Log, handler}
}

// HandlerFunc is a handler that wraps around every api handler, providing common functionality such writing error and logging logging.
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
