package lessonplan

import (
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-playground/validator/v10"
	"github.com/pkg/errors"

	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
)

func NewRouter(server rest.Server, store Store) *chi.Mux {
	r := chi.NewRouter()
	r.Method("POST", "/", postNewLessonPlan(server, store))

	return r
}

func postNewLessonPlan(server rest.Server, store Store) http.Handler {
	type reqBody struct {
		Title       string `json:"title" validate:"required"`
		ClassId     string `json:"classId" validate:"required"`
		Description string `json:"description"`
		Repetition  int    `json:"repetition"`
	}

	type resBody struct {
		Id    string `json:"id"`
		Title string `json:"title"`
	}

	validate := validator.New()

	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
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

		planInput := postgres.PlanData{
			ClassId:     body.ClassId,
			Title:       body.Title,
			Description: body.Description,
			Repetition:  body.Repetition,
		}

		lessonPlan, err := store.CreateLessonPlan(planInput)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "failed to create lesson plan",
				Error:   err,
			}
		}

		w.WriteHeader(http.StatusCreated)
		if err := rest.WriteJson(w, &resBody{
			Id:    lessonPlan.Id,
			Title: lessonPlan.Title,
		}); err != nil {
			return rest.NewWriteJsonError(err)
		}

		return nil
	})
}