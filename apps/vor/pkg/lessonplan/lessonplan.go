package lessonplan

import (
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-pg/pg/v9"
	"github.com/go-playground/validator/v10"
	"github.com/pkg/errors"

	"github.com/chrsep/vor/pkg/rest"
)

func NewRouter(server rest.Server, store Store) *chi.Mux {
	r := chi.NewRouter()
	r.Route("/{planId}", func(r chi.Router) {
		r.Method("GET", "/", getLessonPlan(server, store))
		r.Method("PATCH", "/", updateLessonPlan(server, store))
		r.Method("DELETE", "/", deleteLessonPlan(server, store))

		r.Method("DELETE", "/file/{fileId}", deleteLessonPlanFile(server, store))
	})

	return r
}

func getLessonPlan(server rest.Server, store Store) http.Handler {
	type resBody struct {
		Id          string    `json:"id"`
		Title       string    `json:"title"`
		Description string    `json:"description"`
		ClassId     string    `json:"classId"`
		Date        time.Time `json:"date"`
		AreaId      string    `json:"areaId"`
		MaterialId  string    `json:"materialId"`
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
		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func updateLessonPlan(server rest.Server, store Store) http.Handler {
	type reqBody struct {
		Title       *string    `json:"title,omitempty"`
		Description *string    `json:"description,omitempty"`
		Date        *time.Time `json:"date,omitempty"`
		ClassId     *string    `json:"classId,omitempty"`
		AreaId      *string    `json:"areaId,omitempty"`
		MaterialId  *string    `json:"materialId,omitempty"`
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

		planInput := UpdatePlanData{
			Id:          planId,
			Title:       body.Title,
			Description: body.Description,
			Date:        body.Date,
			AreaId:      body.AreaId,
			MaterialId:  body.MaterialId,
			ClassId:     body.ClassId,
		}
		rowsAffected, err := store.UpdateLessonPlan(planInput)
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
