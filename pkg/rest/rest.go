package rest

import (
	"github.com/getsentry/sentry-go"
	"go.uber.org/zap"
	"net/http"
)

type Error struct {
	Code    int
	Message string
	Error   error
}
type HandlerFunc func(http.ResponseWriter, *http.Request) *Error

type Handler struct {
	Logger  *zap.Logger
	Handler HandlerFunc
}

func (a Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// For centralized logging of Error
	if err := a.Handler(w, r); err != nil {
		w.WriteHeader(err.Code)
		if err.Code >= http.StatusInternalServerError {
			// Server Error
			sentry.CaptureException(err.Error)
			a.Logger.Error(err.Message, zap.Error(err.Error))
			res := NewErrorJson("Something went wrong")
			_ = WriteJson(w, res)
		} else if err.Code >= http.StatusBadRequest {
			// User Error
			a.Logger.Warn(err.Message, zap.Error(err.Error))
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
