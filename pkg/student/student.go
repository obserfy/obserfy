package student

import (
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
	"net/http"
	"time"
)

func NewRouter(server rest.Server, store Store) *chi.Mux {
	handler := handler{server, store}
	r := chi.NewRouter()
	r.Route("/{studentId}", func(r chi.Router) {
		r.Method("GET", "/", handler.getStudent())
		r.Method("DELETE", "/", handler.deleteStudent())
		// TODO:Use PATCH instead of PUT, and implement UPSERT
		r.Method("PUT", "/", handler.upsertStudent())

		r.Method("POST", "/observations", handler.addObservation())
		r.Method("GET", "/observations", handler.getObservations())

		r.Method("GET", "/materialsProgress", handler.getProgress())
		r.Method("PATCH", "/materialsProgress/{materialId}", handler.upsertProgress())
	})
	return r
}

type handler struct {
	rest.Server
	store Store
}

func (h *handler) getStudent() http.Handler {
	type responseBody struct {
		Id          string     `json:"id"`
		Name        string     `json:"name"`
		DateOfBirth *time.Time `json:"dateOfBirth,omitempty"`
	}
	return h.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		id := chi.URLParam(r, "studentId")

		student, err := h.store.Get(id)
		if err != nil {
			return &rest.Error{http.StatusNotFound, "Can't find student with specified id", err}
		}

		response := responseBody{
			Id:          student.Id,
			Name:        student.Name,
			DateOfBirth: student.DateOfBirth,
		}
		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func (h *handler) deleteStudent() http.Handler {
	return h.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		studentId := chi.URLParam(r, "studentId") // from a route like /users/{userID}
		if err := h.store.Delete(studentId); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed deleting student", err}
		}
		return nil
	})
}

func (h *handler) upsertStudent() http.Handler {
	type requestBody struct {
		Name        string     `json:"name"`
		DateOfBirth *time.Time `json:"dateOfBirth"`
	}
	type responseBody struct {
		Id          string     `json:"id"`
		Name        string     `json:"name"`
		DateOfBirth *time.Time `json:"dateOfBirth,omitempty"`
	}
	return h.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		targetId := chi.URLParam(r, "studentId") // from a route like /users/{userID}

		var requestBody requestBody
		if err := rest.ParseJson(r.Body, &requestBody); err != nil {
			return rest.NewParseJsonError(err)
		}

		oldStudent, err := h.store.Get(targetId)
		if err != nil {
			return &rest.Error{http.StatusNotFound, "Can't find old student data", err}
		}

		newStudent := oldStudent
		newStudent.Name = requestBody.Name
		newStudent.DateOfBirth = requestBody.DateOfBirth
		if err := h.store.Update(newStudent); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed updating old student data", err}
		}

		response := responseBody{
			Id:          newStudent.Id,
			Name:        newStudent.Name,
			DateOfBirth: newStudent.DateOfBirth,
		}
		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func (h *handler) addObservation() http.Handler {
	var requestBody struct {
		ShortDesc  string `json:"shortDesc"`
		LongDesc   string `json:"longDesc"`
		CategoryId string `json:"categoryId"`
	}
	return h.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		id := chi.URLParam(r, "studentId")

		if err := rest.ParseJson(r.Body, &requestBody); err != nil {
			return rest.NewParseJsonError(err)
		}

		observationId := uuid.New()
		observation := postgres.Observation{
			Id:          observationId.String(),
			StudentId:   id,
			ShortDesc:   requestBody.ShortDesc,
			LongDesc:    requestBody.LongDesc,
			CategoryId:  requestBody.CategoryId,
			CreatedDate: time.Now(),
		}
		if err := h.store.InsertObservation(observation); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed inserting observation", err}
		}

		w.WriteHeader(http.StatusCreated)
		if err := rest.WriteJson(w, observation); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func (h *handler) getObservations() http.Handler {
	return h.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		id := chi.URLParam(r, "studentId")

		// TODO: Do not return SQL related observation model
		observations, err := h.store.GetObservations(id)
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Fail to query students", err}
		}

		if err := rest.WriteJson(w, observations); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func (h *handler) getProgress() http.Handler {
	type responseBody struct {
		AreaId       string    `json:"areaId"`
		MaterialName string    `json:"materialName"`
		MaterialId   string    `json:"materialId"`
		Stage        int       `json:"stage"`
		UpdatedAt    time.Time `json:"updatedAt"`
	}
	return h.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		studentId := chi.URLParam(r, "studentId")
		//areaId := r.URL.Query().Get("areaId")

		progress, err := h.store.GetProgress(studentId)
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed querying material", err}
		}

		// return empty array when there is no data
		response := make([]responseBody, 0)
		for _, progress := range progress {
			response = append(response, responseBody{
				AreaId:       progress.Material.Subject.Area.Id,
				MaterialName: progress.Material.Name,
				MaterialId:   progress.MaterialId,
				Stage:        progress.Stage,
				UpdatedAt:    progress.UpdatedAt,
			})
		}

		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func (h *handler) upsertProgress() http.Handler {
	type requestBody struct {
		Stage int `json:"stage"`
	}
	return h.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		studentId := chi.URLParam(r, "studentId")
		materialId := chi.URLParam(r, "materialId")

		var requestBody requestBody
		if err := rest.ParseJson(r.Body, &requestBody); err != nil {
			return rest.NewParseJsonError(err)
		}

		progress := postgres.StudentMaterialProgress{
			MaterialId: materialId,
			StudentId:  studentId,
			Stage:      requestBody.Stage,
			UpdatedAt:  time.Now(),
		}
		if _, err := h.store.UpdateProgress(progress); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed updating progress", err}
		}
		return nil
	})
}
