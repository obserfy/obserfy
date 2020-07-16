package images

import (
	"github.com/chrsep/vor/pkg/domain"
	"github.com/chrsep/vor/pkg/imgproxy"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
	"net/http"
)

type Store interface {
	FindImageById(id uuid.UUID) (domain.Image, error)
}

func NewRouter(server rest.Server, store Store, imgproxyClient imgproxy.Client) *chi.Mux {
	r := chi.NewRouter()
	r.Route("/{imageId}", func(r chi.Router) {
		r.Method("GET", "/", getImage(server, store, imgproxyClient))
	})
	return r
}

func getImage(server rest.Server, store Store, client imgproxy.Client) http.Handler {
	type responseBody struct {
		Id  string `json:"id"`
		Url string `json:"url"`
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
			Id:  image.Id.String(),
			Url: client.GenerateUrl(image.ObjectKey, 100, 100),
		}
		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}
