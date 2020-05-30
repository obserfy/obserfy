package lessonplan

import (
	"github.com/go-pg/pg/v9"
	"net/http"
	"time"

	"github.com/go-chi/chi"

	"github.com/chrsep/vor/pkg/rest"
)

func NewRouter(server rest.Server, store Store) *chi.Mux {
	r := chi.NewRouter()
	r.Route("/{planId}", func(r chi.Router) {
		r.Method("PATCH", "/", updateLessonPlan(server, store))
		r.Method("DELETE", "/", deleteLessonPlan(server, store))
	})

	return r
}

func updateLessonPlan(server rest.Server, store Store) http.Handler {
	type reqBody struct {
		Title       *string    `json:"title, omitempty"`
		Description *string    `json:"description,omitempty"`
		Type        *int       `json:"type,omitempty" validate:"oneof= 1 2"`
		Repetition  *int       `json:"repetition,omitempty" validate:"oneof= 0 1 2"`
		StartTime   *time.Time `json:"startTime,omitempty"`
		EndTime     *time.Time `json:"endTime,omitempty"`
	}

	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		body := reqBody{}
		planId := chi.URLParam(r, "planId")

		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}

		isValid := true
		errMsg := ""
		if body.Type != nil {
			if *body.Type == TypeRepeat &&
				(body.EndTime == nil || body.Repetition == nil) {
				isValid = false
				errMsg = "End time and repetition must be filled"
			}
		}

		if !isValid {
			return &rest.Error{
				Code:    http.StatusBadRequest,
				Message: errMsg,
			}
		}

		planInput := UpdatePlanData{
			PlanId:      planId,
			Title:       body.Title,
			Description: body.Description,
			Type:        body.Type,
			Repetition:  body.Repetition,
			StartTime:   body.StartTime,
			EndTime:     body.EndTime,
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