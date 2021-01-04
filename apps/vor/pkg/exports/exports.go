package exports

import (
	"github.com/chrsep/vor/pkg/auth"
	"github.com/chrsep/vor/pkg/domain"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"net/http"
)

type Store interface {
	GetObservations(schoolId string, studentId string, search string, startDate string, endDate string) ([]domain.Observation, error)
	CheckPermissions(schoolId string, userId string) (bool, error)
}

func NewRouter(s rest.Server, store Store) *chi.Mux {
	r := chi.NewRouter()
	r.Route("/{schoolId}", func(r chi.Router) {
		observationAuthMiddleware(s, store)
		r.Method("GET", "/observations", exportObservations(s, store))
	})
	return r
}

func observationAuthMiddleware(s rest.Server, store Store) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
			schoolId := chi.URLParam(r, "schoolId")

			// Verify user access to the school
			session, ok := auth.GetSessionFromCtx(r.Context())
			if !ok {
				return auth.NewGetSessionError()
			}
			userHasAccess, err := store.CheckPermissions(schoolId, session.UserId)
			if err != nil {
				return &rest.Error{
					Code:    http.StatusInternalServerError,
					Message: "Internal Server Error",
					Error:   err,
				}

			}
			// Check if user is related to the school
			if !userHasAccess {
				return &rest.Error{
					Code:    http.StatusNotFound,
					Message: "Observation not found",
					Error:   err,
				}
			}

			next.ServeHTTP(w, r)
			return nil
		})
	}
}

func exportObservations(s rest.Server, store Store) http.Handler {
	type observationItem struct {
		Date      string `csv:"Date"`
		Area      string `csv:"Area"`
		ShortDesc string `csv:"Short Description"`
		Details   string `csv:"Details"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		queries := r.URL.Query()
		schoolId := chi.URLParam(r, "schoolId")
		studentId := queries.Get("studentId")
		searchQuery := queries.Get("search")
		startDateQuery := queries.Get("startDate")
		endDateQuery := queries.Get("endDate")

		observations, err := store.GetObservations(schoolId, studentId, searchQuery, startDateQuery, endDateQuery)
		if err != nil {
			return rest.NewInternalServerError(err, "failed to get observations")
		}

		body := make([]observationItem, 0)
		for _, observation := range observations {
			o := observationItem{
				Date:      observation.EventTime.Format("2006-01-02"),
				Details:   observation.LongDesc,
				ShortDesc: observation.ShortDesc,
			}
			if observation.Area.Id != "" {
				o.Area = observation.Area.Name
			}
			body = append(body, o)
		}
		if err := rest.WriteCsv(w, body); err != nil {
			return rest.NewWriteCsvError(err)
		}

		return nil
	})
}
