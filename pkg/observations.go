package main

import (
	"github.com/go-chi/chi"
	"github.com/go-pg/pg/v9"
	"go.uber.org/zap"
	"net/http"
	"time"
)

type Observation struct {
	Id          string    `json:"id" pg:",type:uuid"`
	StudentId   string    `json:"studentId"`
	ShortDesc   string    `json:"shortDesc"`
	LongDesc    string    `json:"longDesc"`
	CategoryId  string    `json:"categoryId"`
	CreatedDate time.Time `json:"createdDate"`
}

func createObservationsSubroute(env Env) *chi.Mux {
	r := chi.NewRouter()
	r.Delete("/{id}", deleteObservation(env))
	r.Put("/{id}", updateObservation(env))
	return r
}

func updateObservation(env Env) http.HandlerFunc {
	type requestBody struct {
		ShortDesc  string `json:"shortDesc"`
		LongDesc   string `json:"longDesc"`
		CategoryId string `json:"categoryId"`
	}
	return func(w http.ResponseWriter, r *http.Request) {
		id := chi.URLParam(r, "id")

		// Query the requested observation
		var observation Observation
		err := env.db.Model(&observation).Where("id=?", id).Select()
		if err == pg.ErrNoRows {
			http.NotFound(w, r)
			return
		}
		if err != nil {
			writeInternalServerError("Failed finding observation id", w, err, env.logger)
			return
		}

		// Parse the request body
		var requestBody requestBody
		if ok := parseJsonRequestBody(w, r, &requestBody, env.logger); !ok {
			return
		}

		// Update the selected observation
		observation.ShortDesc = requestBody.ShortDesc
		observation.LongDesc = requestBody.LongDesc
		observation.CategoryId = requestBody.CategoryId
		err = env.db.Update(&observation)
		if err != nil {
			writeInternalServerError("Failed updating observation", w, err, env.logger)
			return
		}

		// Return the updated observation
		_ = writeJsonResponseOld(w, observation, env.logger)
	}
}

func deleteObservation(env Env) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := chi.URLParam(r, "id")
		observation := Observation{Id: id}
		err := env.db.Delete(&observation)
		if err != nil {
			env.logger.Error("Failed deleting observation", zap.Error(err))
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
		}
	}
}
