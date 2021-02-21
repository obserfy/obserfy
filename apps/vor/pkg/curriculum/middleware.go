package curriculum

import (
	"net/http"

	"github.com/go-chi/chi"
	"github.com/google/uuid"

	"github.com/chrsep/vor/pkg/auth"
	"github.com/chrsep/vor/pkg/rest"
)

func curriculumAuthMiddleware(server rest.Server, store Store) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
			session, ok := auth.GetSessionFromCtx(r.Context())
			if !ok {
				return auth.NewGetSessionError()
			}

			curriculumId := chi.URLParam(r, "curriculumId")
			if _, err := uuid.Parse(curriculumId); err != nil {
				return &rest.Error{
					Code:    http.StatusNotFound,
					Message: "Can't find the specified curriculum",
					Error:   err,
				}
			}

			userHasAccess, err := store.CheckCurriculumPermission(curriculumId, session.UserId)
			if err != nil {
				return &rest.Error{Code: http.StatusInternalServerError, Message: "Internal Server Error", Error: err}
			}
			if !userHasAccess {
				return &rest.Error{Code: http.StatusNotFound, Message: "Subject not found", Error: err}
			}
			next.ServeHTTP(w, r)
			return nil
		})
	}
}

func subjectAuthMiddleware(server rest.Server, store Store) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
			session, ok := auth.GetSessionFromCtx(r.Context())
			if !ok {
				return auth.NewGetSessionError()
			}
			subjectId := chi.URLParam(r, "subjectId")
			userHasAccess, err := store.CheckSubjectPermissions(subjectId, session.UserId)
			if err != nil {
				return &rest.Error{Code: http.StatusInternalServerError, Message: "Internal Server Error", Error: err}
			}
			if !userHasAccess {
				return &rest.Error{Code: http.StatusNotFound, Message: "Subject not found", Error: err}
			}
			next.ServeHTTP(w, r)
			return nil
		})
	}
}

func areaAuthMiddleware(server rest.Server, store Store) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
			areaId := chi.URLParam(r, "areaId")
			session, ok := auth.GetSessionFromCtx(r.Context())
			if !ok {
				return auth.NewGetSessionError()
			}

			userHasAccess, err := store.CheckAreaPermissions(areaId, session.UserId)
			if err != nil {
				return &rest.Error{Code: http.StatusInternalServerError, Message: "Internal Server Error", Error: err}
			}
			if !userHasAccess {
				return &rest.Error{Code: http.StatusNotFound, Message: "Area not found", Error: err}
			}

			next.ServeHTTP(w, r)
			return nil
		})
	}
}

func materialAuthMiddleware(s rest.Server, store Store) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
			materialId := chi.URLParam(r, "materialId")
			session, ok := auth.GetSessionFromCtx(r.Context())
			if !ok {
				return auth.NewGetSessionError()
			}

			userHasAccess, err := store.CheckMaterialPermission(materialId, session.UserId)
			if err != nil {
				return &rest.Error{
					Code:    http.StatusInternalServerError,
					Message: "Internal Server Error",
					Error:   err,
				}
			}
			if !userHasAccess {
				return &rest.Error{
					Code:    http.StatusNotFound,
					Message: "material not found",
					Error:   err,
				}
			}

			next.ServeHTTP(w, r)
			return nil
		})
	}
}
