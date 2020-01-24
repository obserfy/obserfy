package observation

import (
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"net/http"
)

type Store interface {
	UpdateObservation(observationId string, shortDesc string, longDesc string, categoryId string) (*postgres.Observation, error)
	DeleteObservation(observationId string) error
}

type server struct {
	rest.Server
	store Store
}

func NewRouter(s rest.Server, store Store) *chi.Mux {
	server := server{s, store}
	r := chi.NewRouter()
	r.Method("DELETE", "/{id}", server.deleteObservation())
	// TODO: Use patch with upsert instead of PUT.
	r.Method("PUT", "/{id}", server.updateObservation())
	return r
}

func (s *server) updateObservation() rest.Handler {
	type requestBody struct {
		ShortDesc  string `json:"shortDesc"`
		LongDesc   string `json:"longDesc"`
		CategoryId string `json:"categoryId"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		id := chi.URLParam(r, "id")
		// Parse the request body
		var requestBody requestBody
		if err := rest.ParseJson(r.Body, &requestBody); err != nil {
			return rest.NewParseJsonError(err)
		}

		observation, err := s.store.UpdateObservation(id, requestBody.ShortDesc, requestBody.LongDesc, requestBody.CategoryId)
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed updating observation", err}
		}

		// Return the updated observation
		if err := rest.WriteJson(w, observation); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func (s *server) deleteObservation() rest.Handler {
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		id := chi.URLParam(r, "id")
		if err := s.store.DeleteObservation(id); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed deleting observation", err}
		}
		return nil
	})
}
