package reports

import (
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
)

func NewRouter(s rest.Server, store postgres.ProgressReportsStore) *chi.Mux {
	r := chi.NewRouter()
	r.Method("GET", "/{reportId}", getReport(s, store))

	return r
}

func getReport(s rest.Server, store postgres.ProgressReportsStore) rest.Handler2 {
	return s.NewHandler2(func(r *rest.Request) rest.ServerResponse {
		id, err := uuid.Parse(r.GetParam("reportId"))
		if err != nil {
			return s.NotFound()
		}

		report, err := store.FindReportById(id)
		if err != nil {
			return s.InternalServerError(err)
		}

		return rest.ServerResponse{
			Body: report,
		}
	})
}
