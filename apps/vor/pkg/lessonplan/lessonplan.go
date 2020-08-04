package lessonplan

import (
	"github.com/google/uuid"
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-pg/pg/v10"
	"github.com/go-playground/validator/v10"
	"github.com/pkg/errors"

	"github.com/chrsep/vor/pkg/rest"
)

func NewRouter(server rest.Server, store Store) *chi.Mux {
	r := chi.NewRouter()
	r.Route("/{planId}", func(r chi.Router) {
		r.Method("GET", "/", getLessonPlan(server, store))
		r.Method("PATCH", "/", patchLessonPlan(server, store))
		r.Method("DELETE", "/", deleteLessonPlan(server, store))

		r.Method("DELETE", "/file/{fileId}", deleteLessonPlanFile(server, store))

		r.Method("POST", "/links", postLink(server, store))
	})
	return r
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

		if err := store.AddLinkToLessonPlan(planId, Link{
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
	type link struct {
		Id          uuid.UUID `json:"id"`
		Url         string    `json:"url"`
		Image       string    `json:"image"`
		Title       string    `json:"title"`
		Description string    `json:"description"`
	}
	type resBody struct {
		Id          string    `json:"id"`
		Title       string    `json:"title"`
		Description string    `json:"description"`
		ClassId     string    `json:"classId"`
		Date        time.Time `json:"date"`
		AreaId      string    `json:"areaId"`
		MaterialId  string    `json:"materialId"`
		Links       []link    `json:"links"`
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
