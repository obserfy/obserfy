package curriculum

import (
	"github.com/chrsep/vor/pkg/auth"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
	"net/http"
)

func (s *server) curriculumAuthMiddleware() func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
			session, ok := auth.GetSessionFromCtx(r.Context())
			if !ok {
				return auth.NewGetSessionError()
			}

			curriculumId := chi.URLParam(r, "curriculumId")
			if _, err := uuid.Parse(curriculumId); err != nil {
				return &rest.Error{
					http.StatusNotFound,
					"Can't find the specified curriculum",
					err,
				}
			}

			userHasAccess, err := s.store.CheckCurriculumPermission(curriculumId, session.UserId)
			if err != nil {
				return &rest.Error{http.StatusInternalServerError, "Internal Server Error", err}
			}
			if !userHasAccess {
				return &rest.Error{http.StatusNotFound, "Subject not found", err}
			}
			next.ServeHTTP(w, r)
			return nil
		})
	}
}

func (s *server) subjectAuthMiddleware() func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
			session, ok := auth.GetSessionFromCtx(r.Context())
			if !ok {
				return auth.NewGetSessionError()
			}
			subjectId := chi.URLParam(r, "subjectId")
			userHasAccess, err := s.store.CheckSubjectPermissions(subjectId, session.UserId)
			if err != nil {
				return &rest.Error{http.StatusInternalServerError, "Internal Server Error", err}
			}
			if !userHasAccess {
				return &rest.Error{http.StatusNotFound, "Subject not found", err}
			}
			next.ServeHTTP(w, r)
			return nil
		})
	}
}

func (s *server) areaAuthMiddleware() func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
			areaId := chi.URLParam(r, "areaId")
			session, ok := auth.GetSessionFromCtx(r.Context())
			if !ok {
				return auth.NewGetSessionError()
			}

			userHasAccess, err := s.store.CheckAreaPermissions(areaId, session.UserId)
			if err != nil {
				return &rest.Error{http.StatusInternalServerError, "Internal Server Error", err}
			}
			if !userHasAccess {
				return &rest.Error{http.StatusNotFound, "Area not found", err}
			}

			next.ServeHTTP(w, r)
			return nil
		})
	}
}

func (s *server) materialAuthMiddleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
			materialId := chi.URLParam(r, "materialId")
			session, ok := auth.GetSessionFromCtx(r.Context())
			if !ok {
				return auth.NewGetSessionError()
			}

			userHasAccess, err := s.store.CheckMaterialPermission(materialId, session.UserId)
			if err != nil {
				return &rest.Error{
					http.StatusInternalServerError,
					"Internal Server Error",
					err,
				}
			}
			if !userHasAccess {
				return &rest.Error{
					http.StatusNotFound,
					"Area not found",
					err,
				}
			}

			next.ServeHTTP(w, r)
			return nil
		})
	}
}
