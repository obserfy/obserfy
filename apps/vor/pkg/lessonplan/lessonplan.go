package lessonplan

import (
	"github.com/chrsep/vor/pkg/auth"
	"github.com/chrsep/vor/pkg/domain"
	"github.com/chrsep/vor/pkg/imgproxy"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"github.com/go-pg/pg/v10"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/pkg/errors"
	richErrors "github.com/pkg/errors"
	"net/http"
	"time"
)

type Store interface {
	UpdateLessonPlan(
		Id string,
		Title *string,
		Description *string,
		Date *time.Time,
		Repetition *domain.RepetitionPattern,
		AreaId *string,
		MaterialId *string,
		ClassId *string,
	) (int, error)
	GetLessonPlan(planId string) (*domain.LessonPlan, error)
	DeleteLessonPlan(planId string) error
	DeleteLessonPlanFile(planId, fileId string) error
	AddLinkToLessonPlan(planId string, link domain.Link) error
	CheckPermission(userId string, planId string) (bool, error)
	AddRelatedStudents(planId string, studentIds []uuid.UUID) ([]domain.Student, error)
	DeleteRelatedStudent(planId string, studentId string) error
}

func NewRouter(server rest.Server, store Store) *chi.Mux {
	r := chi.NewRouter()
	r.Route("/{planId}", func(r chi.Router) {
		r.Use(authorizationMiddleware(server, store))

		r.Method("GET", "/", getLessonPlan(server, store))
		r.Method("PATCH", "/", patchLessonPlan(server, store))
		r.Method("DELETE", "/", deleteLessonPlan(server, store))

		r.Method("DELETE", "/file/{fileId}", deleteLessonPlanFile(server, store))

		r.Method("POST", "/links", postLink(server, store))

		r.Method("POST", "/students", postNewRelatedStudents(server, store))
		r.Method("DELETE", "/students/{studentId}", deleteRelatedStudent(server, store))
	})
	return r
}

func authorizationMiddleware(s rest.Server, store Store) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
			planId := chi.URLParam(r, "planId")

			if _, err := uuid.Parse(planId); err != nil {
				return &rest.Error{
					http.StatusNotFound,
					"Can't find the specified plan",
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

			authorized, err := store.CheckPermission(session.UserId, planId)
			if err != nil {
				return &rest.Error{
					Code:    http.StatusInternalServerError,
					Message: "failed to query plan data",
					Error:   err,
				}
			}
			if !authorized {
				return &rest.Error{
					Code:    http.StatusNotFound,
					Message: "We can't find the given plan",
					Error:   richErrors.New("unauthorized access to plan data"),
				}
			}

			next.ServeHTTP(w, r)
			return nil
		})
	}
}
func postLink(server rest.Server, store Store) http.Handler {
	type requestBody struct {
		Url         string `json:"url"`
		Image       string `json:"image"`
		Title       string `json:"title"`
		Description string `json:"description"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		planId := chi.URLParam(r, "planId")
		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}

		if err := store.AddLinkToLessonPlan(planId, domain.Link{
			Url:         body.Url,
			Image:       body.Image,
			Title:       body.Title,
			Description: body.Description,
		}); err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "failed to save additional new link to lesson plan",
				Error:   err,
			}
		}

		w.WriteHeader(http.StatusCreated)
		return nil
	})
}

func getLessonPlan(server rest.Server, store Store) http.Handler {
	type student struct {
		Id              string `json:"id"`
		Name            string `json:"name"`
		ProfileImageUrl string `json:"profileImageUrl,omitempty"`
	}
	type link struct {
		Id          uuid.UUID `json:"id"`
		Url         string    `json:"url"`
		Image       string    `json:"image"`
		Title       string    `json:"title"`
		Description string    `json:"description"`
	}
	type resBody struct {
		Id              string    `json:"id"`
		Title           string    `json:"title"`
		Description     string    `json:"description"`
		ClassId         string    `json:"classId"`
		Date            time.Time `json:"date"`
		AreaId          string    `json:"areaId"`
		MaterialId      string    `json:"materialId"`
		Links           []link    `json:"links"`
		RelatedStudents []student `json:"relatedStudents"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		planId := chi.URLParam(r, "planId")

		plan, err := store.GetLessonPlan(planId)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "failed to query lesson plan",
				Error:   err,
			}
		}

		response := resBody{
			Id:          plan.Id,
			Title:       plan.Title,
			Description: plan.Description,
			ClassId:     plan.ClassId,
			Date:        plan.Date,
			MaterialId:  plan.MaterialId,
			AreaId:      plan.AreaId,
		}
		for _, l := range plan.Links {
			response.Links = append(response.Links, link{
				Id:          l.Id,
				Url:         l.Url,
				Image:       l.Image,
				Title:       l.Title,
				Description: l.Description,
			})
		}
		for _, s := range plan.Students {
			item := student{
				Id:   s.Id,
				Name: s.Name,
			}
			if s.ProfileImage.ObjectKey != "" {
				item.ProfileImageUrl = imgproxy.GenerateUrl(s.ProfileImage.ObjectKey, 32, 32)
			}
			response.RelatedStudents = append(response.RelatedStudents, item)
		}
		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func patchLessonPlan(server rest.Server, store Store) http.Handler {
	type reqBody struct {
		Title       *string    `json:"title"`
		Description *string    `json:"description"`
		Date        *time.Time `json:"date"`
		ClassId     *string    `json:"classId"`
		AreaId      *string    `json:"areaId"`
		MaterialId  *string    `json:"materialId"`
	}

	validate := validator.New()
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		planId := chi.URLParam(r, "planId")

		body := reqBody{}
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}
		if err := validate.Struct(body); err != nil {
			return &rest.Error{
				Code:    http.StatusBadRequest,
				Message: err.Error(),
				Error:   errors.Wrapf(err, "invalid request body"),
			}
		}

		rowsAffected, err := store.UpdateLessonPlan(
			planId,
			body.Title,
			body.Description,
			body.Date,
			nil, // TODO: we should handle repetition
			body.AreaId,
			body.MaterialId,
			body.ClassId,
		)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "Failed to update lesson plan",
				Error:   err,
			}
		}

		if rowsAffected == 0 {
			return &rest.Error{
				Code:    http.StatusNotFound,
				Message: "Can't find specified lesson plan",
			}
		}

		w.WriteHeader(http.StatusNoContent)
		return nil
	})
}

func deleteLessonPlan(server rest.Server, store Store) http.Handler {
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		planId := chi.URLParam(r, "planId")

		err := store.DeleteLessonPlan(planId)
		if err != nil {
			if err == pg.ErrNoRows {
				return &rest.Error{
					Code:    http.StatusNotFound,
					Message: "No lesson plan found",
					Error:   err,
				}
			}
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "Failed to delete lesson plan",
				Error:   err,
			}
		}

		w.WriteHeader(http.StatusOK)
		return nil
	})
}

func deleteLessonPlanFile(server rest.Server, store Store) http.Handler {
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		planId := chi.URLParam(r, "planId")
		fileId := chi.URLParam(r, "fileId")

		err := store.DeleteLessonPlanFile(planId, fileId)
		if err != nil {
			if err == pg.ErrNoRows {
				return &rest.Error{
					Code:    http.StatusNotFound,
					Message: "No file found on lesson plan",
					Error:   err,
				}
			}
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "Failed to delete file on lesson plan",
				Error:   err,
			}
		}

		w.WriteHeader(http.StatusOK)
		return nil
	})
}

func postNewRelatedStudents(s rest.Server, store Store) http.Handler {
	type requestBody struct {
		StudentIds []uuid.UUID `json:"studentIds"`
	}
	type student struct {
		Id              string `json:"id"`
		Name            string `json:"name"`
		ProfileImageUrl string `json:"profileImageUrl,omitempty"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		planId := chi.URLParam(r, "planId")

		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}

		relatedStudents, err := store.AddRelatedStudents(planId, body.StudentIds)
		if err != nil {
			return rest.NewInternalServerError(err, "failed to save lesson plan related student to DB")
		}

		response := make([]student, 0)
		for _, s := range relatedStudents {
			newStudent := student{
				Id:   s.Id,
				Name: s.Name,
			}
			if s.ProfileImage.ObjectKey != "" {
				newStudent.ProfileImageUrl = imgproxy.GenerateUrl(s.ProfileImage.ObjectKey, 32, 32)
			}
			response = append(response, newStudent)
		}

		w.WriteHeader(http.StatusCreated)
		if err := rest.WriteJson(w, &response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func deleteRelatedStudent(s rest.Server, store Store) http.Handler {
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		planId := chi.URLParam(r, "planId")
		studentId := chi.URLParam(r, "studentId")

		if err := store.DeleteRelatedStudent(planId, studentId); err != nil {
			return rest.NewInternalServerError(err, "failed to delete lesson plan related student to DB")
		}

		w.WriteHeader(http.StatusOK)
		return nil
	})
}
