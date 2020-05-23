package lessonplan

import (
	"net/http"

	"github.com/go-chi/chi"

	"github.com/chrsep/vor/pkg/rest"
)

func NewRouter(server rest.Server, store Store) *chi.Mux {
	r := chi.NewRouter()
	r.Route("/{planId}", func(r chi.Router) {
		r.Method("PATCH", "/", updateLessonPlan(server, store))
	})

	return r
}

func updateLessonPlan(server rest.Server, store Store) http.Handler {
	type reqBody struct {
		Title       *string `json:"title"`
		Description *string `json:"description"`
		Repetition  *int `json:"repetition"`
	}

	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		body := reqBody{}
		//planId := chi.URLParam(r, "planId")

		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}

		return nil
	})
}