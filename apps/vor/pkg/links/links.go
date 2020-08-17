package links

import (
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
	"net/http"
)

type Store interface {
	UpdateLink(id string, title *string, url *string, image *string, description *string) error
	DeleteLink(id uuid.UUID) error
}

func NewRouter(server rest.Server, store Store) *chi.Mux {
	r := chi.NewRouter()
	r.Route("/{linkId}", func(r chi.Router) {
		r.Method("PATCH", "/", patchLink(server, store))
		r.Method("DELETE", "/", deleteLink(server, store))
	})
	return r
}

func patchLink(server rest.Server, store Store) http.Handler {
	type requestBody struct {
		Url         *string `json:"url"`
		Image       *string `json:"image"`
		Title       *string `json:"title"`
		Description *string `json:"description"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		linkId := chi.URLParam(r, "linkId")

		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}

		if err := store.UpdateLink(
			linkId,
			body.Title,
			body.Url,
			body.Image,
			body.Description,
		); err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "failed to update link",
				Error:   err,
			}
		}

		w.WriteHeader(http.StatusNoContent)
		return nil
	})
}

func deleteLink(server rest.Server, store Store) http.Handler {
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		linkId, err := uuid.Parse(chi.URLParam(r, "linkId"))
		if err != nil {
			return &rest.Error{
				Code:    http.StatusNotFound,
				Message: "can't find the specified link",
				Error:   err,
			}
		}

		if err := store.DeleteLink(linkId); err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "failed to delete link",
				Error:   err,
			}
		}

		return nil
	})
}
