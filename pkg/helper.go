package main

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
)

func writeJson(w http.ResponseWriter, object interface{}) error {
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

func parseJson(input io.ReadCloser, result interface{}) error {
	return json.NewDecoder(input).Decode(result)
}

// Possible common errors
func createParseJsonError(err error) *HTTPError {
	return &HTTPError{http.StatusBadRequest, "Failed parsing input", err}
}

func createGetSessionError() *HTTPError {
	return &HTTPError{http.StatusUnauthorized, "Unauthorized", errors.New("session can't be found on context")}
}

func createWriteJsonError(err error) *HTTPError {
	return &HTTPError{http.StatusInternalServerError, "Failed writing json response", err}
}
