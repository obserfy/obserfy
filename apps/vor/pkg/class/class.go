package class

import (
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/pkg/errors"

	"github.com/chrsep/vor/pkg/lessonplan"
	"github.com/chrsep/vor/pkg/rest"
)

func NewRouter(server rest.Server, store Store, lpStore lessonplan.Store) *chi.Mux {
	r := chi.NewRouter()
	r.Route("/{classId}", func(r chi.Router) {
		r.Use(authorizationMiddleware(server, store))
		r.Method("GET", "/", getClass(server, store))
		r.Method("DELETE", "/", deleteClass(server, store))
		r.Method("PATCH", "/", updateClass(server, store))
		r.Method("GET", "/session", getClassSession(server, store))

		r.Method("POST", "/plans", postNewLessonPlan(server, lpStore))
	})
	return r
}

func authorizationMiddleware(s rest.Server, store Store) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
			classId := chi.URLParam(r, "classId")

			if _, err := uuid.Parse(classId); err != nil {
				return &rest.Error{
					http.StatusNotFound,
					"Can't find the specified class",
					err,
				}
			}

			// TODO: Checking permission causes cyclic dependency, enable after
			// 	refactor.
			//session, ok := auth.GetSessionFromCtx(r.Context())
			//if !ok {
			//	return &rest.Error{
			//		http.StatusUnauthorized,
			//		"You're not logged in",
			//		richErrors.New("no session found"),
			//	}
			//}
			//authorized, err := store.CheckPermission(session.UserId, classId)
			//if !authorized {
			//	return &rest.Error{
			//		Code:    http.StatusNotFound,
			//		Message: "We can't find the given class",
			//		Error:   err,
			//	}
			//}

			next.ServeHTTP(w, r)
			return nil
		})
	}
}
func getClassSession(server rest.Server, store Store) http.Handler {
	type responseBody struct {
		Date string `json:"date"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		classId := chi.URLParam(r, "classId")
		classSession, err := store.GetClassSession(classId)

		if err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "failed querying attendance",
				Error:   err,
			}
		}
		if err := rest.WriteJson(w, classSession); err != nil {
			return rest.NewWriteJsonError(err)
		}

		return nil
	})
}
func updateClass(server rest.Server, store Store) http.Handler {
	type requestBody struct {
		Name      string         `json:"name"`
		Weekdays  []time.Weekday `json:"weekdays"`
		StartTime time.Time      `json:"startTime"`
		EndTime   time.Time      `json:"endTime"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		classId := chi.URLParam(r, "classId")

		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}

		rowsEffected, err := store.UpdateClass(
			classId,
			body.Name,
			body.Weekdays,
			body.StartTime,
			body.EndTime,
		)
		if err != nil {
			return &rest.Error{
				http.StatusInternalServerError,
				"Failed upsert class",
				err,
			}
		}
		if rowsEffected == 0 {
			return &rest.Error{
				http.StatusNotFound,
				"Can't find the specified class",
				err,
			}
		}

		w.WriteHeader(http.StatusNoContent)
		return nil
	})
}

func getClass(server rest.Server, store Store) http.Handler {
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		classId := chi.URLParam(r, "classId")
		class, err := store.GetClass(classId)
		if err != nil {
			return &rest.Error{
				http.StatusInternalServerError,
				"Failed querying class",
				err,
			}
		}
		if class == nil {
			return &rest.Error{
				http.StatusNotFound,
				"Can't find the specified class",
				err,
			}
		}
		if err := rest.WriteJson(w, class); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func deleteClass(server rest.Server, store Store) http.Handler {
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		classId := chi.URLParam(r, "classId")
		rowsEffected, err := store.DeleteClass(classId)
		if err != nil {
			return &rest.Error{
				http.StatusInternalServerError,
				"Failed deleting class",
				err,
			}
		}
		if rowsEffected == 0 {
			return &rest.Error{
				http.StatusNotFound,
				"Can't find the specified class",
				err,
			}
		}
		return nil
	})
}

func postNewLessonPlan(server rest.Server, store lessonplan.Store) http.Handler {
	type reqBody struct {
		Title       string    `json:"title" validate:"required"`
		Description string    `json:"description"`
		Type        int       `json:"type" validate:"oneof=0 1 2 3"`
		StartTime   time.Time `json:"startTime" validate:"required"`
		EndTime     *time.Time`json:"endTime,omitempty"`
		FileIds     []string  `json:"fileIds"`
	}

	type resBody struct {
		Id    string `json:"id"`
		Title string `json:"title"`
	}

	validate := validator.New()

	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		body := reqBody{}
		classId := chi.URLParam(r, "classId")

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

		// validate repetition data
		var errMsg string
		var err error

		isValid := true

		if body.Type != lessonplan.RepetitionNone && body.EndTime == nil {
			isValid = false
			errMsg = "End time can't be empty"
		}

		if !isValid {
			return &rest.Error{
				Code:    http.StatusBadRequest,
				Message: errMsg,
			}
		}

		planInput := lessonplan.PlanData{
			ClassId:     classId,
			Title:       body.Title,
			Description: body.Description,
			Type:        body.Type,
			FileIds:     body.FileIds,
			StartTime:   body.StartTime,
			EndTime:     body.EndTime,
		}

		lessonPlan, err := store.CreateLessonPlan(planInput)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "Failed to create lesson plan",
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
