package progress_report

import (
	"github.com/chrsep/vor/pkg/auth"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
	"net/http"
	"time"
)

func NewRouter(s rest.Server, store postgres.ProgressReportsStore) *chi.Mux {
	r := chi.NewRouter()

	r.Route("/{reportId}", func(r chi.Router) {
		r.Use(authorizationMiddleware(s, store))
		r.Method("GET", "/", getReport(s, store))
		r.Method("PATCH", "/", patchReport(s, store))
		r.Method("DELETE", "/", deleteReport(s, store))

		r.Method("POST", "/published", updateReportPublished(s, store))

		r.Method("GET", "/students/{studentId}", getStudentReport(s, store))
		r.Method("PATCH", "/students/{studentId}", patchStudentReport(s, store))

		r.Method("PUT", "/students/{studentId}/areas/{areaId}/comments", putStudentAreaComment(s, store))
		r.Method("GET", "/students/{studentId}/areas/{areaId}/assessments", getStudentReportAssessmentsByArea(s, store))
	})

	return r
}

func authorizationMiddleware(s rest.Server, store postgres.ProgressReportsStore) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
			reportId, err := uuid.Parse(chi.URLParam(r, "reportId"))
			if err != nil {
				return &rest.Error{
					Code:    http.StatusNotFound,
					Message: "can't find the given report",
					Error:   err,
				}
			}

			session, ok := auth.GetSessionFromCtx(r.Context())
			if !ok {
				return auth.NewGetSessionError()
			}

			user, err := store.FindUserByUserIdAndRelationToReport(reportId, session.UserId)
			if err != nil {
				return &rest.Error{
					Code:    http.StatusInternalServerError,
					Message: "failed to find report",
					Error:   err,
				}

			}

			if user.Id != session.UserId {
				return &rest.Error{
					Code:    http.StatusNotFound,
					Message: "user is not related to report",
					Error:   err,
				}
			}

			next.ServeHTTP(w, r)
			return nil
		})
	}
}

func getReport(s rest.Server, store postgres.ProgressReportsStore) rest.Handler2 {
	return s.NewHandler2(func(r *rest.Request) rest.ServerResponse {
		id, _ := uuid.Parse(r.GetParam("reportId"))

		report, err := store.FindReportWithStudentReportsById(id)
		if err != nil {
			return s.InternalServerError(err)
		}

		studentReports := make([]rest.H, len(report.StudentReports))
		for i, studentReport := range report.StudentReports {
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
				"published":       report.Published,
			},
		}
	})
}

func patchReport(s rest.Server, store postgres.ProgressReportsStore) rest.Handler2 {
	type requestBody struct {
		Title       *string    `json:"title"`
		PeriodStart *time.Time `json:"periodStart"`
		PeriodEnd   *time.Time `json:"periodEnd"`
	}
	return s.NewHandler2(func(r *rest.Request) rest.ServerResponse {
		id, _ := uuid.Parse(r.GetParam("reportId"))

		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return s.BadRequest(err)
		}

		report, err := store.UpdateReport(id, body.Title, body.PeriodStart, body.PeriodEnd, nil)
		if err != nil {
			return s.InternalServerError(err)
		}

		return rest.ServerResponse{
			Body: rest.H{
				"id":          report.Id,
				"title":       report.Title,
				"periodStart": report.PeriodStart,
				"periodEnd":   report.PeriodEnd,
				"published":   report.Published,
			},
		}
	})
}

func deleteReport(s rest.Server, store postgres.ProgressReportsStore) rest.Handler2 {
	return s.NewHandler2(func(r *rest.Request) rest.ServerResponse {
		id, _ := uuid.Parse(r.GetParam("reportId"))

		if err := store.DeleteReportById(id); err != nil {
			return s.InternalServerError(err)
		}

		return rest.ServerResponse{Status: http.StatusOK}
	})
}

func updateReportPublished(s rest.Server, store postgres.ProgressReportsStore) rest.Handler2 {
	type requestBody struct {
		Published bool `json:"published"`
	}
	return s.NewHandler2(func(r *rest.Request) rest.ServerResponse {
		reportId, _ := uuid.Parse(r.GetParam("reportId"))

		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return s.BadRequest(err)
		}

		report, err := store.UpdateReport(reportId, nil, nil, nil, &body.Published)
		if err != nil {
			return s.InternalServerError(err)
		}

		return rest.ServerResponse{
			Status: http.StatusOK,
			Body: rest.H{
				"published": report.Published,
			},
		}
	})
}

func patchStudentReport(s rest.Server, store postgres.ProgressReportsStore) rest.Handler2 {
	type requestBody struct {
		GeneralComments *string `json:"generalComments"`
		Ready           *bool   `json:"ready"`
	}
	return s.NewHandler2(func(r *rest.Request) rest.ServerResponse {
		reportId, _ := uuid.Parse(r.GetParam("reportId"))
		studentId, err := uuid.Parse(r.GetParam("studentId"))
		if err != nil {
			return s.NotFound()
		}

		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return s.BadRequest(err)
		}

		studentReport, err := store.PatchStudentReport(reportId, studentId, body.Ready, body.GeneralComments)
		if err != nil {
			return s.InternalServerError(err)
		}

		return rest.ServerResponse{
			Body: rest.H{
				"ready":           studentReport.Ready,
				"generalComments": studentReport.GeneralComments,
			},
		}
	})
}

func putStudentAreaComment(s rest.Server, store postgres.ProgressReportsStore) http.Handler {
	type requestBody struct {
		Comments string `json:"comments"`
	}
	return s.NewHandler2(func(r *rest.Request) rest.ServerResponse {
		reportId, _ := uuid.Parse(r.GetParam("reportId"))
		studentId, err := uuid.Parse(r.GetParam("studentId"))
		areaId, err := uuid.Parse(r.GetParam("areaId"))
		if err != nil {
			return s.NotFound()
		}

		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return s.BadRequest(err)
		}

		studentReport, err := store.UpsertStudentReportAreaComments(reportId, studentId, areaId, body.Comments)
		if err != nil {
			return s.InternalServerError(err)
		}

		return rest.ServerResponse{
			Body: rest.H{
				"comments": studentReport.Comments,
			},
		}
	})
}

func getStudentReport(s rest.Server, store postgres.ProgressReportsStore) rest.Handler2 {
	return s.NewHandler2(func(r *rest.Request) rest.ServerResponse {
		reportId, _ := uuid.Parse(r.GetParam("reportId"))
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

func getStudentReportAssessmentsByArea(s rest.Server, store postgres.ProgressReportsStore) http.Handler {
	return s.NewHandler2(func(r *rest.Request) rest.ServerResponse {
		reportId, _ := uuid.Parse(r.GetParam("reportId"))
		studentId, err := uuid.Parse(r.GetParam("studentId"))
		areaId, err := uuid.Parse(r.GetParam("areaId"))
		if err != nil {
			return s.NotFound()
		}

		report, err := store.FindReportById(reportId)
		if err != nil {
			return s.InternalServerError(err)
		}

		// use frozen assessments when report is frozen
		if report.FreezeAssessments {
			assessments, err := store.FindFrozenStudentAssessmentByArea(reportId, studentId, areaId)
			if err != nil {
				return s.InternalServerError(err)
			}

			responseBody := make([]rest.H, len(assessments))
			for i, assessment := range assessments {
				responseBody[i] = rest.H{
					"areaId":       assessment.Material.Subject.AreaId,
					"materialName": assessment.Material.Name,
					"materialId":   assessment.MaterialId,
					"assessment":   assessment.Assessment,
					"updatedAt":    assessment.UpdatedAt,
				}
			}

			return rest.ServerResponse{Body: responseBody}
		}

		// find live assessment data when not frozen
		assessments, err := store.FindLiveStudentAssessmentByArea(studentId, areaId)
		if err != nil {
			return s.InternalServerError(err)
		}

		responseBody := make([]rest.H, len(assessments))
		for i, assessment := range assessments {
			responseBody[i] = rest.H{
				"areaId":       assessment.Material.Subject.AreaId,
				"materialName": assessment.Material.Name,
				"materialId":   assessment.MaterialId,
				"assessment":   assessment.Stage,
				"updatedAt":    assessment.UpdatedAt,
			}
		}

		return rest.ServerResponse{Body: responseBody}
	})
}
