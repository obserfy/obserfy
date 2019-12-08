package main

import (
	"encoding/json"
	"go.uber.org/zap"
	"net/http"
)

func writeJsonResponse(w http.ResponseWriter, object interface{}, logger *zap.Logger) error {
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

func parseJsonRequestBody(w http.ResponseWriter, r *http.Request, requestBody interface{}, logger *zap.Logger) bool {
	err := json.NewDecoder(r.Body).Decode(requestBody)
	if err != nil {
		logger.Error("Failed to decode request body", zap.Error(err))
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return false
	}
	return true
}

func writeInternalServerError(message string, w http.ResponseWriter, err error, logger *zap.Logger) {
	logger.Error(message, zap.Error(err))
	http.Error(w, "Something went wrong", http.StatusInternalServerError)
}
