package student

import (
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"net/http"
	"time"
)

func NewRouter(s rest.Server, store Store) *chi.Mux {
	server := server{s, store}
	r := chi.NewRouter()
	r.Route("/{studentId}", func(r chi.Router) {
		r.Method("GET", "/", server.handleGetStudent())
		r.Method("DELETE", "/", server.handleDeleteStudent())
		// TODO:Use PATCH instead of PUT, and implement UPSERT
		r.Method("PUT", "/", server.handleUpsertStudent())

		r.Method("POST", "/observations", server.handleAddObservation())
		r.Method("GET", "/observations", server.handleGetObservation())

		r.Method("GET", "/materialsProgress", server.handleGetProgress())
		r.Method("PATCH", "/materialsProgress/{materialId}", server.handleUpsertProgress())
	})
	return r
}

type server struct {
	rest.Server
	store Store
}

func (s *server) handleGetStudent() http.Handler {
	type responseBody struct {
		Id          string     `json:"id"`
		Name        string     `json:"name"`
		DateOfBirth *time.Time `json:"dateOfBirth,omitempty"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		id := chi.URLParam(r, "studentId")

		student, err := s.store.Get(id)
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

func (s *server) handleDeleteStudent() http.Handler {
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		studentId := chi.URLParam(r, "studentId") // from a route like /users/{userID}
		if err := s.store.Delete(studentId); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed deleting student", err}
		}
		return nil
	})
}

func (s *server) handleUpsertStudent() http.Handler {
	type requestBody struct {
		Name        string     `json:"name"`
		DateOfBirth *time.Time `json:"dateOfBirth"`
	}
	type responseBody struct {
		Id          string     `json:"id"`
		Name        string     `json:"name"`
		DateOfBirth *time.Time `json:"dateOfBirth,omitempty"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		targetId := chi.URLParam(r, "studentId") // from a route like /users/{userID}

		var requestBody requestBody
		if err := rest.ParseJson(r.Body, &requestBody); err != nil {
			return rest.NewParseJsonError(err)
		}

		oldStudent, err := s.store.Get(targetId)
		if err != nil {
			return &rest.Error{http.StatusNotFound, "Can't find old student data", err}
		}

		newStudent := oldStudent
		newStudent.Name = requestBody.Name
		newStudent.DateOfBirth = requestBody.DateOfBirth
		if err := s.store.Update(newStudent); err != nil {
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

func (s *server) handleAddObservation() http.Handler {
	var requestBody struct {
		ShortDesc  string `json:"shortDesc"`
		LongDesc   string `json:"longDesc"`
		CategoryId string `json:"categoryId"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		id := chi.URLParam(r, "studentId")

		if err := rest.ParseJson(r.Body, &requestBody); err != nil {
			return rest.NewParseJsonError(err)
		}

		observation, err := s.store.InsertObservation(id, requestBody.LongDesc, requestBody.ShortDesc, requestBody.CategoryId)
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed inserting observation", err}
		}

		w.WriteHeader(http.StatusCreated)
		if err := rest.WriteJson(w, observation); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func (s *server) handleGetObservation() http.Handler {
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		id := chi.URLParam(r, "studentId")

		// TODO: Do not return SQL related observation model
		observations, err := s.store.GetObservations(id)
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Fail to query students", err}
		}

		if err := rest.WriteJson(w, observations); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func (s *server) handleGetProgress() http.Handler {
	type responseBody struct {
		AreaId       string    `json:"areaId"`
		MaterialName string    `json:"materialName"`
		MaterialId   string    `json:"materialId"`
		Stage        int       `json:"stage"`
		UpdatedAt    time.Time `json:"updatedAt"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		studentId := chi.URLParam(r, "studentId")
		//areaId := r.URL.Query().Get("areaId")

		progress, err := s.store.GetProgress(studentId)
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

func (s *server) handleUpsertProgress() http.Handler {
	type requestBody struct {
		Stage int `json:"stage"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
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
		if _, err := s.store.UpdateProgress(progress); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed updating progress", err}
		}
		return nil
	})
}
