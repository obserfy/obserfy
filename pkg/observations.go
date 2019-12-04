package main

import (
	"github.com/go-chi/chi"
	"go.uber.org/zap"
	"net/http"
	"time"
)

type Observation struct {
	Id          string    `json:"id" pg:",type:uuid"`
	StudentId   string    `json:"studentId"`
	ShortDesc   string    `json:"shortDesc"`
	LongDesc    string    `json:"longDesc"`
	CreatedDate time.Time `json:"createdDate"`
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
