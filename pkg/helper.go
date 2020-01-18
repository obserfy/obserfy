package main

import (
	"encoding/json"
	"errors"
	"go.uber.org/zap"
	"io"
	"net/http"
)

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

// TODO: Remove writeJsonResponseOld
func writeJsonResponseOld(w http.ResponseWriter, object interface{}, logger *zap.Logger) error {
	res, err := json.Marshal(object)
	if err != nil {
		logger.Error("Failed marshalling user data", zap.Error(err))
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		return err
	}
	w.Header().Add("Content-Type", "application/json")
	_, err = w.Write(res)
	if err != nil {
		logger.Error("Fail writing response for getting user detail", zap.Error(err))
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		return err
	}
	return err
}

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

// TODO: Replace this completely with parseJson
func parseJsonRequestBody(w http.ResponseWriter, r *http.Request, requestBody interface{}, logger *zap.Logger) bool {
	err := json.NewDecoder(r.Body).Decode(requestBody)
	if err != nil {
		logger.Error("Failed to decode request body", zap.Error(err))
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return false
	}
	return true
}

func parseJson(input io.ReadCloser, result interface{}) error {
	return json.NewDecoder(input).Decode(result)
}

// TODO: Remove writeInternalServerError, we're moving to centralized logging
func writeInternalServerError(message string, w http.ResponseWriter, err error, logger *zap.Logger) {
	logger.Error(message, zap.Error(err))
	http.Error(w, "Something went wrong", http.StatusInternalServerError)
}

// Possible common errors
func createParseJsonError(err error) *HTTPError {
	return &HTTPError{err, "Failed parsing input", http.StatusBadRequest}
}

func createGetSessionError() *HTTPError {
	return &HTTPError{errors.New("session can't be found on context"), "Unauthorized", http.StatusUnauthorized}
}

func createWriteJsonError(err error) *HTTPError {
	return &HTTPError{err, "Failed writing json response", http.StatusInternalServerError}
}