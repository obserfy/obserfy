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

	r.Method("GET", "/{reportId}/students/{studentId}", getStudentReport(s, store))
	r.Method("PATCH", "/{reportId}/students/{studentId}", patchStudentReport(s, store))
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

func patchStudentReport(s rest.Server, store postgres.ProgressReportsStore) rest.Handler2 {
	type requestBody struct {
		Done bool `json:"done"`
	}
	return s.NewHandler2(func(r *rest.Request) rest.ServerResponse {
		reportId, err := uuid.Parse(r.GetParam("reportId"))
		if err != nil {
			return s.NotFound()
		}
		studentId, err := uuid.Parse(r.GetParam("studentId"))
		if err != nil {
			return s.NotFound()
		}

		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return s.BadRequest(err)
		}

		studentReport, err := store.PatchStudentReport(reportId, studentId, body.Done)
		if err != nil {
			return s.InternalServerError(err)
		}

		return rest.ServerResponse{
			Body: studentReport,
		}
	})
}

func getStudentReport(s rest.Server, store postgres.ProgressReportsStore) rest.Handler2 {
	return s.NewHandler2(func(r *rest.Request) rest.ServerResponse {
		reportId, err := uuid.Parse(r.GetParam("reportId"))
		if err != nil {
			return s.NotFound()
		}
		studentId, err := uuid.Parse(r.GetParam("studentId"))
		if err != nil {
			return s.NotFound()
		}

		report, err := store.FindStudentReportById(reportId, studentId)
		if err != nil {
			return s.InternalServerError(err)
		}

		return rest.ServerResponse{
			Body: report,
		}
	})
}
