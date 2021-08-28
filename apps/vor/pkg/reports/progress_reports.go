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

		studentReports := make([]rest.H, len(report.StudentsReports))
		for i, studentReport := range report.StudentsReports {
			areaComments := make([]rest.H, len(studentReport.AreaComments))
			for k, comment := range studentReport.AreaComments {
				areaComments[k] = rest.H{
					"comments": comment.Comments,
				}
			}

			classes := make([]rest.H, len(studentReport.Student.Classes))
			for k, c := range studentReport.Student.Classes {
				classes[k] = rest.H{
					"id":   c.Id,
					"name": c.Name,
				}
			}

			studentReports[i] = rest.H{
				"ready":           studentReport.Ready,
				"generalComments": studentReport.GeneralComments,
				"areaComments":    areaComments,
				"student": rest.H{
					"id":      studentReport.Student.Id,
					"name":    studentReport.Student.Name,
					"classes": classes,
				},
			}
		}

		return rest.ServerResponse{
			Body: rest.H{
				"id":              report.Id,
				"title":           report.Title,
				"periodStart":     report.PeriodStart,
				"periodEnd":       report.PeriodEnd,
				"studentsReports": studentReports,
			},
		}
	})
}

func patchStudentReport(s rest.Server, store postgres.ProgressReportsStore) rest.Handler2 {
	type requestBody struct {
		Ready bool `json:"ready"`
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

		studentReport, err := store.PatchStudentReport(reportId, studentId, body.Ready)
		if err != nil {
			return s.InternalServerError(err)
		}

		return rest.ServerResponse{
			Body: rest.H{
				"ready": studentReport.Ready,
			},
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

		areaComments := make([]rest.H, len(report.AreaComments))
		for k, comment := range report.AreaComments {
			areaComments[k] = rest.H{
				"comments": comment.Comments,
				"areaId":   comment.Area.Id,
			}
		}

		return rest.ServerResponse{
			Body: rest.H{
				"progressReport": rest.H{
					"id":          report.ProgressReport.Id,
					"title":       report.ProgressReport.Title,
					"periodStart": report.ProgressReport.PeriodStart,
					"periodEnd":   report.ProgressReport.PeriodEnd,
				},
				"areaComments":    areaComments,
				"generalComments": report.GeneralComments,
				"ready":           report.Ready,
				"student": rest.H{
					"id":   report.Student.Id,
					"name": report.Student.Name,
				},
			},
		}
	})
}
