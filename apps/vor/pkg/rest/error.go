package rest

import "net/http"

type Error struct {
	Code    int    // Status code of the http response
	Message string // Message to be shown to user
	Error   error  // Error to be reported to sentry/log
}

func NewInternalServerError(err error, message string) *Error {
	return &Error{
		Code:    http.StatusInternalServerError,
		Message: message,
		Error:   err,
	}
}
