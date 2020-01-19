package main

import (
	"encoding/json"
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

func createWriteJsonError(err error) *HTTPError {
	return &HTTPError{http.StatusInternalServerError, "Failed writing json response", err}
}

func parseJson(input io.ReadCloser, result interface{}) error {
	return json.NewDecoder(input).Decode(result)
}

func createParseJsonError(err error) *HTTPError {
	return &HTTPError{http.StatusBadRequest, "Failed parsing input", err}
}
