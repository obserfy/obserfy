package class

import (
	"net/http"
	"time"

	"github.com/chrsep/vor/pkg/lessonplan"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
)

func NewRouter(server rest.Server, store Store, lpStore lessonplan.Store) *chi.Mux {
	r := chi.NewRouter()
	r.Route("/{classId}", func(r chi.Router) {
		r.Use(authorizationMiddleware(server, store))
		r.Method("GET", "/", getClass(server, store))
		r.Method("DELETE", "/", deleteClass(server, store))
		r.Method("PATCH", "/", updateClass(server, store))
		r.Method("GET", "/sessions", getClassSession(server, store))
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

			// TODO: Checking permission causes cyclic dependency, enable after
			// 	refactor.
			//session, ok := auth.GetSessionFromCtx(r.Context())
			//if !ok {
			//	return &rest.Error{
			//		http.StatusUnauthorized,
			//		"You're not logged in",
			//		richErrors.New("no session found"),
			//	}
			//}
			//authorized, err := store.CheckPermission(session.UserId, classId)
			//if !authorized {
			//	return &rest.Error{
			//		Code:    http.StatusNotFound,
			//		Message: "We can't find the given class",
			//		Error:   err,
			//	}
			//}

			next.ServeHTTP(w, r)
			return nil
		})
	}
}

func getClassSession(server rest.Server, store Store) http.Handler {
	type responseBody struct {
		Date string `json:"date"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		classId := chi.URLParam(r, "classId")
		classSession, err := store.GetClassSession(classId)

		if err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "failed querying attendance",
				Error:   err,
			}
		}
		if err := rest.WriteJson(w, classSession); err != nil {
			return rest.NewWriteJsonError(err)
		}

		return nil
	})
}

func updateClass(server rest.Server, store Store) http.Handler {
	type requestBody struct {
		Name      string         `json:"name"`
		Weekdays  []time.Weekday `json:"weekdays"`
		StartTime time.Time      `json:"startTime"`
		EndTime   time.Time      `json:"endTime"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		classId := chi.URLParam(r, "classId")

		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}

		rowsEffected, err := store.UpdateClass(
			classId,
			body.Name,
			body.Weekdays,
			body.StartTime,
			body.EndTime,
		)
		if err != nil {
			return &rest.Error{
				http.StatusInternalServerError,
				"Failed upsert class",
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

		w.WriteHeader(http.StatusNoContent)
		return nil
	})
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
