package guardian

import (
	"github.com/chrsep/vor/pkg/auth"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
	richErrors "github.com/pkg/errors"
	"net/http"
)

func NewRouter(server rest.Server, store Store) *chi.Mux {
	r := chi.NewRouter()
	r.Route("/{guardianId}", func(r chi.Router) {
		r.Use(authorizationMiddleware(server, store))
		r.Method("GET", "/", getGuardian(server, store))
		r.Method("DELETE", "/", deleteGuardian(server, store))
		r.Method("PATCH", "/", updateClass(server, store))
	})
	return r
}

func authorizationMiddleware(s rest.Server, store Store) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
			guardianId := chi.URLParam(r, "guardianId")

			if _, err := uuid.Parse(guardianId); err != nil {
				return &rest.Error{
					http.StatusNotFound,
					"Can't find the specified guardian",
					err,
				}
			}

			session, ok := auth.GetSessionFromCtx(r.Context())
			if !ok {
				return &rest.Error{
					http.StatusUnauthorized,
					"You're not logged in",
					richErrors.New("no session found"),
				}
			}

			authorized, err := store.CheckPermission(session.UserId, guardianId)
			if !authorized {
				return &rest.Error{
					Code:    http.StatusNotFound,
					Message: "We can't find the given class",
					Error:   err,
				}
			}

			next.ServeHTTP(w, r)
			return nil
		})
	}
}

func getGuardian(server rest.Server, store Store) http.Handler {
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		guardianId := chi.URLParam(r, "guardianId")

		guardian, err := store.GetGuardian(guardianId)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusNotFound,
				Message: "can't find the specified guardian",
				Error:   err,
			}
		}

		if err := rest.WriteJson(w, guardian); err != nil {
			return rest.NewWriteJsonError(err)
		}

		return nil
	})
}

func deleteGuardian(server rest.Server, store Store) http.Handler {
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		guardianId := chi.URLParam(r, "guardianId")

		err := store.DeleteGuardian(guardianId)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusNotFound,
				Message: "can't find the specified guardian",
				Error:   err,
			}
		}

		return nil
	})
}

func updateClass(server rest.Server, store Store) http.Handler {
	type requestBody struct {
		Name  string `json:"name"`
		Email string `json:"email"`
		Phone string `json:"phone"`
		Note  string `json:"note"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		guardianId := chi.URLParam(r, "guardianId")

		var body requestBody
		if err := rest.ParseJson(r.Body, body); err != nil {
			return &rest.Error{
				Code:    http.StatusBadRequest,
				Message: "invalid request body",
				Error:   err,
			}
		}

		err := store.UpdateGuardian(Guardian{
			Id:    guardianId,
			Name:  body.Name,
			Email: body.Email,
			Phone: body.Phone,
			Note:  body.Note,
		})
		if err != nil {
			return &rest.Error{
				Code:    http.StatusNotFound,
				Message: "can't find the specified guardian",
				Error:   err,
			}
		}

		return nil
	})
}
