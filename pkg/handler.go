package main

import (
	"github.com/getsentry/sentry-go"
	"go.uber.org/zap"
	"net/http"
)

type HTTPError struct {
	code    int
	message string
	error   error
}

type AppHandler struct {
	env     Env
	handler func(http.ResponseWriter, *http.Request) *HTTPError
}

func (a AppHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// For centralized logging of error
	if err := a.handler(w, r); err != nil {
		w.WriteHeader(err.code)
		if err.code >= http.StatusInternalServerError {
			// Server error
			sentry.CaptureException(err.error)
			a.env.logger.Error(err.message, zap.Error(err.error))
			res := createErrorResponse("Something went wrong")
			_ = writeJson(w, res)
		} else if err.code >= http.StatusBadRequest {
			// User error
			a.env.logger.Warn(err.message, zap.Error(err.error))
			res := createErrorResponse(err.message)
			_ = writeJson(w, res)
		}
	}
}

type ErrorResponse struct {
	Error ErrorResponseMessage `json:"error"`
}

type ErrorResponseMessage struct {
	Message string `json:"message"`
}

func createErrorResponse(message string) ErrorResponse {
	return ErrorResponse{ErrorResponseMessage{
		Message: message,
	}}
}
