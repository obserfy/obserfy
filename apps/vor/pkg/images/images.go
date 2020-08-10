package images

import (
	"github.com/chrsep/vor/pkg/domain"
	"github.com/chrsep/vor/pkg/imgproxy"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
	"net/http"
	"time"
)

type Store interface {
	FindImageById(id uuid.UUID) (domain.Image, error)
	DeleteImageById(id uuid.UUID) error
}

func NewRouter(server rest.Server, store Store, imgproxyClient imgproxy.Client) *chi.Mux {
	r := chi.NewRouter()
	r.Route("/{imageId}", func(r chi.Router) {
		r.Method("GET", "/", getImage(server, store, imgproxyClient))
		r.Method("DELETE", "/", deleteImage(server, store))
	})
	return r
}

func getImage(server rest.Server, store Store, client imgproxy.Client) http.Handler {
	type responseBody struct {
		Id          string    `json:"id"`
		Url         string    `json:"url"`
		OriginalUrl string    `json:"originalUrl"`
		CreatedAt   time.Time `json:"createdAt"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		imageId, err := uuid.Parse(chi.URLParam(r, "imageId"))
		if err != nil {
			return &rest.Error{
				Code:    http.StatusNotFound,
				Message: "can't find image with the specified id",
				Error:   err,
			}
		}

		image, err := store.FindImageById(imageId)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "failed to query image",
				Error:   err,
			}
		}
		if (domain.Image{}) == image {
			return &rest.Error{
				Code:    http.StatusNotFound,
				Message: "can't find image with the specified id",
				Error:   err,
			}
		}

		response := &responseBody{
			Id:          image.Id.String(),
			Url:         client.GenerateUrl(image.ObjectKey, 100, 100),
			OriginalUrl: client.GenerateOriginalUrl(image.ObjectKey),
			CreatedAt:   image.CreatedAt,
		}
		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func deleteImage(server rest.Server, store Store) http.Handler {
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		imageId, err := uuid.Parse(chi.URLParam(r, "imageId"))
		if err != nil {
			return &rest.Error{
				Code:    http.StatusNotFound,
				Message: "can't find image with the specified id",
				Error:   err,
			}
		}

		err = store.DeleteImageById(imageId)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "failed to delete image",
				Error:   err,
			}
		}
		return nil
	})
}
