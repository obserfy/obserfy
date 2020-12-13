package guardian

import (
	"net/http"

	"github.com/go-chi/chi"
	"github.com/google/uuid"
	richErrors "github.com/pkg/errors"

	"github.com/chrsep/vor/pkg/auth"
	"github.com/chrsep/vor/pkg/rest"
)

func NewRouter(server rest.Server, store Store) *chi.Mux {
	r := chi.NewRouter()
	r.Route("/{guardianId}", func(r chi.Router) {
		r.Use(authorizationMiddleware(server, store))
		r.Method("GET", "/", getGuardian(server, store))
		r.Method("DELETE", "/", deleteGuardian(server, store))
		r.Method("PATCH", "/", patchGuardian(server, store))
	})
	return r
}

func authorizationMiddleware(s rest.Server, store Store) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
			guardianId := chi.URLParam(r, "guardianId")

			if _, err := uuid.Parse(guardianId); err != nil {
				return &rest.Error{
					Code:    http.StatusNotFound,
					Message: "Can't find the specified guardian",
					Error:   err,
				}
			}

			session, ok := auth.GetSessionFromCtx(r.Context())
			if !ok {
				return &rest.Error{
					Code:    http.StatusUnauthorized,
					Message: "You're not logged in",
					Error:   richErrors.New("no session found"),
				}
			}

			authorized, err := store.CheckPermission(session.UserId, guardianId)
			if err != nil {
				return &rest.Error{
					Code:    http.StatusInternalServerError,
					Message: "failed to query guardian data",
					Error:   err,
				}
			}
			if !authorized {
				return &rest.Error{
					Code:    http.StatusNotFound,
					Message: "We can't find the given class",
					Error:   richErrors.New("unauthorized access to guardian data"),
				}
			}

			next.ServeHTTP(w, r)
			return nil
		})
	}
}

func getGuardian(server rest.Server, store Store) http.Handler {
	type child struct {
		Id   string `json:"id"`
		Name string `json:"name"`
	}
	type responseBody struct {
		Id       string  `json:"id"`
		Name     string  `json:"name"`
		Email    string  `json:"email"`
		Phone    string  `json:"phone"`
		Note     string  `json:"note"`
		Address  string  `json:"address"`
		Children []child `json:"children"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		guardianId := chi.URLParam(r, "guardianId")

		guardian, err := store.GetGuardian(guardianId)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "failed querying guardian data",
				Error:   err,
			}
		}
		if guardian == nil {
			return &rest.Error{
				Code:    http.StatusNotFound,
				Message: "can't find the specified guardian",
				Error:   err,
			}
		}

		response := &responseBody{
			Id:       guardian.Id,
			Name:     guardian.Name,
			Email:    guardian.Email,
			Phone:    guardian.Phone,
			Note:     guardian.Note,
			Address:  guardian.Address,
			Children: make([]child, 0),
		}
		for _, c := range guardian.Children {
			response.Children = append(response.Children, child{
				Id:   c.Id,
				Name: c.Name,
			})
		}
		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func deleteGuardian(server rest.Server, store Store) http.Handler {
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		guardianId := chi.URLParam(r, "guardianId")

		rowsAffected, err := store.DeleteGuardian(guardianId)
		if rowsAffected < 1 {
			return &rest.Error{
				Code:    http.StatusNotFound,
				Message: "can't find the specified guardian",
				Error:   err,
			}
		}
		if err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "failed to delete guardian",
				Error:   err,
			}
		}

		w.WriteHeader(http.StatusNoContent)
		return nil
	})
}

func patchGuardian(server rest.Server, store Store) http.Handler {
	type requestBody struct {
		Name    *string `json:"name"`
		Email   *string `json:"email"`
		Phone   *string `json:"phone"`
		Note    *string `json:"note"`
		Address *string `json:"address"`
	}

	type child struct {
		Id   string `json:"id"`
		Name string `json:"name"`
	}
	type responseBody struct {
		Id       string  `json:"id"`
		Name     string  `json:"name"`
		Email    string  `json:"email"`
		Phone    string  `json:"phone"`
		Note     string  `json:"note"`
		Address  string  `json:"address"`
		Children []child `json:"children"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		guardianId := chi.URLParam(r, "guardianId")

		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return &rest.Error{
				Code:    http.StatusBadRequest,
				Message: "invalid request body",
				Error:   err,
			}
		}

		if (requestBody{}) == body {
			return &rest.Error{
				Code:    http.StatusBadRequest,
				Message: "request body can't be empty",
				Error:   richErrors.New("empty request body"),
			}
		}

		newGuardian, err := store.UpdateGuardian(
			guardianId,
			body.Name,
			body.Email,
			body.Phone,
			body.Note,
			body.Address,
		)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusNotFound,
				Message: "can't find the specified guardian",
				Error:   err,
			}
		}

		response := &responseBody{
			Id:      newGuardian.Id,
			Name:    newGuardian.Name,
			Email:   newGuardian.Email,
			Phone:   newGuardian.Phone,
			Note:    newGuardian.Note,
			Address: newGuardian.Address,
		}
		for _, c := range newGuardian.Children {
			response.Children = append(response.Children, child{
				Id:   c.Id,
				Name: c.Name,
			})
		}
		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}
