package main

import (
	"github.com/go-chi/chi"
	"go.uber.org/zap"
	"net/http"
	"time"
)

type Observation struct {
	Id          string    `json:"id" pg:",type:uuid"`
	StudentId   string    `json:"student_id"`
	ShortDesc   string    `json:"short_desc"`
	LongDesc    string    `json:"long_desc"`
	CreatedDate time.Time `json:"created_date"`
}

func createObservationsSubroute(env Env) *chi.Mux {
	r := chi.NewRouter()
	r.Delete("/{id}", deleteObservation(env))
	return r
}

func deleteObservation(env Env) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := chi.URLParam(r, "id")
		observation := Observation{Id: id}
		err := env.db.Delete(&observation)
		if err != nil {
			env.logger.Error("Failed deleting student", zap.Error(err))
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
		}
	}
}
