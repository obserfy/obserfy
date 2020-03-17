package class

import (
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
	"net/http"
)

func NewRouter(server rest.Server, store Store) *chi.Mux {
	r := chi.NewRouter()
	r.Route("/{classId}", func(r chi.Router) {
		r.Use(authorizationMiddleware(server, store))
		r.Method("GET", "/", getClass(server, store))
		r.Method("DELETE", "/", deleteClass(server, store))
	})
	return r
}

func authorizationMiddleware(s rest.Server, store Store) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
			classId := chi.URLParam(r, "classId")

			if _, err := uuid.Parse(classId); err != nil {
				return &rest.Error{
					http.StatusNotFound,
					"Can't find the specified class",
					err,
				}
			}

			next.ServeHTTP(w, r)
			return nil
		})
	}
}

func getClass(server rest.Server, store Store) http.Handler {
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		classId := chi.URLParam(r, "classId")
		class, err := store.GetClass(classId)
		if err != nil {
			return &rest.Error{
				http.StatusInternalServerError,
				"Failed querying class",
				err,
			}
		}
		if class == nil {
			return &rest.Error{
				http.StatusNotFound,
				"Can't find the specified class",
				err,
			}
		}
		if err := rest.WriteJson(w, class); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func deleteClass(server rest.Server, store Store) http.Handler {
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		classId := chi.URLParam(r, "classId")
		rowsEffected, err := store.DeleteClass(classId)
		if err != nil {
			return &rest.Error{
				http.StatusInternalServerError,
				"Failed deleting class",
				err,
			}
		}
		if rowsEffected == 0 {
			return &rest.Error{
				http.StatusNotFound,
				"Can't find the specified class",
				err,
			}
		}
		return nil
	})
}
