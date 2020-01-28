package rest

import (
	"encoding/json"
	"io"
	"net/http"
)

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
