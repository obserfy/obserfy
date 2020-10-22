package rest

import "net/http"

type ErrorJson struct {
	Error ErrorPayload `json:"error"`
}

type ErrorPayload struct {
	Message string `json:"message"`
}

func NewInternalServerError(err error, message string) *Error {
	return &Error{
		Code:    http.StatusInternalServerError,
		Message: message,
		Error:   err,
	}
}
