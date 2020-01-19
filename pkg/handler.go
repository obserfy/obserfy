package main

import (
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
			a.env.logger.Error(err.message, zap.Error(err.error))
			res := createErrorResponse("InternalError", "Something went wrong")
			_ = writeJson(w, res)
		} else if err.code >= http.StatusBadRequest {
			// User error
			a.env.logger.Warn(err.message, zap.Error(err.error))
			res := createErrorResponse(string(err.code), err.message)
			_ = writeJson(w, res)
		}
	}
}

type ErrorResponse struct {
	Error ErrorResponseMessage `json:"error"`
}

type ErrorResponseMessage struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

func createErrorResponse(code string, message string) ErrorResponse {
	return ErrorResponse{ErrorResponseMessage{
		Code:    code,
		Message: message,
	}}
}
