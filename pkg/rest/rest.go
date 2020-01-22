package rest

import (
	"encoding/json"
	"github.com/getsentry/sentry-go"
	"github.com/go-pg/pg/v9"
	"go.uber.org/zap"
	"io"
	"net/http"
)

type Error struct {
	Code    int
	Message string
	Error   error
}

type Handler struct {
	Logger  *zap.Logger
	Handler func(http.ResponseWriter, *http.Request) *Error
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

type ErrorJson struct {
	Error ErrorPayload `json:"Error"`
}

type ErrorPayload struct {
	Message string `json:"message"`
}

func NewErrorJson(message string) ErrorJson {
	return ErrorJson{ErrorPayload{
		Message: message,
	}}
}

func WriteJson(w http.ResponseWriter, object interface{}) error {
	res, err := json.Marshal(object)
	if err != nil {
		return err
	}
	if _, err = w.Write(res); err != nil {
		return err
	}
	w.Header().Add("Content-Type", "application/json")
	return nil
}

func NewWriteJsonError(err error) *Error {
	return &Error{http.StatusInternalServerError, "Failed writing json response", err}
}

func ParseJson(input io.ReadCloser, result interface{}) error {
	return json.NewDecoder(input).Decode(result)
}

func NewParseJsonError(err error) *Error {
	return &Error{http.StatusBadRequest, "Failed parsing input", err}
}

type Env struct {
	db           *pg.DB
	logger       *zap.Logger
	studentStore StudentStore
}
