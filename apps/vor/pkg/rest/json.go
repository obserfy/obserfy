package rest

import (
	"encoding/json"
	richErrors "github.com/pkg/errors"
	"io"
	"net/http"
)

func WriteJson(w http.ResponseWriter, object interface{}) error {
	w.Header().Add("Content-Type", "application/json")
	res, err := json.Marshal(object)
	if err != nil {
		return err
	}
	if _, err = w.Write(res); err != nil {
		return err
	}
	return nil
}

func ParseJson(input io.ReadCloser, result interface{}) error {
	err := json.NewDecoder(input).Decode(result)
	return richErrors.Wrap(err, "Failed parsing json")
}

// Json related errors
func NewWriteJsonError(err error) *Error {
	return &Error{
		http.StatusInternalServerError,
		"Fail to write json response",
		richErrors.Wrap(err, "fail to write json body"),
	}
}

func NewParseJsonError(err error) *Error {
	return &Error{
		http.StatusBadRequest,
		"Fail to parse json request body",
		richErrors.Wrap(err, "fail to parse json request body"),
	}
}
