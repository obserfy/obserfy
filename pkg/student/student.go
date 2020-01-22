package student

import (
	"github.com/go-chi/chi"
	"go.uber.org/zap"
)

type env struct {
	logger *zap.Logger
	store  Store
}

func NewRouter(logger *zap.Logger, store Store) *chi.Mux {
	env := env{logger, store}
	r := chi.NewRouter()
	r.Route("/{studentId}", func(r chi.Router) {
		r.Method("GET", "/", getStudentHandler(env))
		r.Method("DELETE", "/", deleteStudentHandler(env))
		// TODO:Use PATCH instead of PUT, and implement UPSERT
		r.Method("PUT", "/", upsertStudentHandler(env))

		r.Method("POST", "/observations", addObservationHandler(env))
		r.Method("GET", "/observations", getObservationsHandler(env))

		r.Method("GET", "/materialsProgress", getProgressHandler(env))
		r.Method("PATCH", "/materialsProgress/{materialId}", upsertProgressHandler(env))
	})
	return r
}
