package observation

import (
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"github.com/go-playground/validator/v10"
	"net/http"
	"time"
)

type Store interface {
	UpdateObservation(observationId string, shortDesc string, longDesc string, categoryId string) (*postgres.Observation, error)
	DeleteObservation(observationId string) error
	GetObservation(id string) (*postgres.Observation, error)
}

func NewRouter(s rest.Server, store Store) *chi.Mux {
	r := chi.NewRouter()
	r.Method("DELETE", "/{observationId}", deleteObservation(s, store))
	// TODO: Use patch with upsert instead of PUT.
	r.Method("PUT", "/{observationId}", updateObservation(s, store))
	r.Method("GET", "/{observationId}", getObservation(s, store))
	return r
}

func updateObservation(s rest.Server, store Store) rest.Handler {
	type requestBody struct {
		ShortDesc  string `json:"shortDesc"`
		LongDesc   string `json:"longDesc"`
		CategoryId string `json:"categoryId"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		id := chi.URLParam(r, "observationId")
		// Parse the request body
		var requestBody requestBody
		if err := rest.ParseJson(r.Body, &requestBody); err != nil {
			return rest.NewParseJsonError(err)
		}

		observation, err := store.UpdateObservation(id, requestBody.ShortDesc, requestBody.LongDesc, requestBody.CategoryId)
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

func deleteObservation(s rest.Server, store Store) rest.Handler {
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		id := chi.URLParam(r, "observationId")
		if err := store.DeleteObservation(id); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed deleting observation", err}
		}
		return nil
	})
}

func getObservation(s rest.Server, store Store) http.Handler {
	type responseBody struct {
		Id          string     `json:"id"`
		StudentName string     `json:"studentName"`
		CategoryId  string     `json:"categoryId"`
		CreatorId   string     `json:"creatorId,omitempty"`
		CreatorName string     `json:"creatorName,omitempty"`
		LongDesc    string     `json:"longDesc"`
		ShortDesc   string     `json:"shortDesc"`
		CreatedDate time.Time  `json:"createdDate"`
		EventTime   *time.Time `json:"eventTime,omitempty"`
	}
	validate := validator.New()
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		observationId := chi.URLParam(r, "observationId")
		err := validate.Var(observationId, "uuid")
		if err != nil {
			return &rest.Error{
				http.StatusNotFound,
				"Can't find the observation with the given ID",
				err,
			}
		}

		observation, err := store.GetObservation(observationId)
		if err != nil {
			return &rest.Error{
				http.StatusInternalServerError,
				"Failed getting observation",
				err,
			}
		}
		if observation == nil {
			return &rest.Error{
				http.StatusNotFound,
				"Can't find the observation with the given ID",
				err,
			}
		}

		response := responseBody{
			Id:          observation.Id,
			StudentName: observation.Student.Name,
			CategoryId:  observation.CategoryId,
			LongDesc:    observation.LongDesc,
			ShortDesc:   observation.ShortDesc,
			EventTime:   observation.EventTime,
			CreatedDate: observation.CreatedDate,
		}
		if observation.CreatorId != "" {
			response.CreatorId = observation.CreatorId
			response.CreatorName = observation.Creator.Name
		}

		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}
