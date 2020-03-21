package rest

import (
	"encoding/json"
	richErrors "github.com/pkg/errors"
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
	return &Error{
		http.StatusInternalServerError,
		"Failed writing json response",
		richErrors.Wrap(err, "Failed parsing input"),
	}
}

func ParseJson(input io.ReadCloser, result interface{}) error {
	err := json.NewDecoder(input).Decode(result)
	return richErrors.Wrap(err, "Failed parsing json")
}

func NewParseJsonError(err error) *Error {
	return &Error{
		http.StatusBadRequest,
		"Failed parsing input",
		richErrors.Wrap(err, "Failed parsing input"),
	}
}
