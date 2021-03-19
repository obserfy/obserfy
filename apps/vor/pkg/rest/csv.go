package rest

import (
	"github.com/gocarina/gocsv"
	richErrors "github.com/pkg/errors"
	"net/http"
)

type ErrorCsv struct {
	Error errorDetails `json:"error"`
}

func WriteCsv(w http.ResponseWriter, object interface{}) error {
	w.Header().Add("Content-Type", "text/csv")
	res, err := gocsv.MarshalBytes(object)
	if err != nil {
		return err
	}
	if _, err = w.Write(res); err != nil {
		return err
	}
	return nil
}

// NewWriteCsvError returns errors related to writing CSVs
func NewWriteCsvError(err error) *Error {
	return &Error{
		http.StatusInternalServerError,
		"Fail to write json response",
		richErrors.Wrap(err, "fail to write json body"),
	}
}
