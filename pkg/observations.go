package main

import (
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"net/http"
)

func createObservationsSubroute(env Env) *chi.Mux {
	r := chi.NewRouter()
	r.Method("DELETE", "/{id}", deleteObservation(env))
	// TODO: Use patch with upsert instead of PUT.
	r.Method("PUT", "/{id}", updateObservation(env))
	return r
}

func updateObservation(env Env) rest.Handler {
	type requestBody struct {
		ShortDesc  string `json:"shortDesc"`
		LongDesc   string `json:"longDesc"`
		CategoryId string `json:"categoryId"`
	}
	return rest.Handler{env.logger, func(w http.ResponseWriter, r *http.Request) *rest.Error {
		id := chi.URLParam(r, "id")

		// Query the requested observation
		var observation postgres.Observation
		if err := env.db.Model(&observation).Where("id=?", id).Select(); err != nil {
			return &rest.Error{http.StatusNotFound, "Can't find the specified observation", err}
		}

		// Parse the request body
		var requestBody requestBody
		if err := rest.ParseJson(r.Body, &requestBody); err != nil {
			return rest.NewParseJsonError(err)
		}

		// Update the selected observation
		observation.ShortDesc = requestBody.ShortDesc
		observation.LongDesc = requestBody.LongDesc
		observation.CategoryId = requestBody.CategoryId
		if err := env.db.Update(&observation); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed updating observation", err}
		}

		// Return the updated observation
		if err := rest.WriteJson(w, observation); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	}}
}

func deleteObservation(env Env) rest.Handler {
	return rest.Handler{env.logger, func(w http.ResponseWriter, r *http.Request) *rest.Error {
		id := chi.URLParam(r, "id")
		observation := postgres.Observation{Id: id}
		if err := env.db.Delete(&observation); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed deleting observation", err}
		}
		return nil
	}}
}
