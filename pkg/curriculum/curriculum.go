package curriculum

import (
	"errors"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"github.com/go-pg/pg/v9"
	"github.com/google/uuid"
	richErrors "github.com/pkg/errors"
	"net/http"
)

type Store interface {
	GetArea(areaId string) (*postgres.Area, error)
	GetAreaSubjects(areaId string) ([]postgres.Subject, error)
	GetSubjectMaterials(subjectId string) ([]postgres.Material, error)
	NewArea(name string, curriculumId string) (string, error)
	NewSubject(name string, areaId string) (*postgres.Subject, error)
	GetSubject(id string) (*postgres.Subject, error)
	UpdateSubject(subject *postgres.Subject) error
}

type server struct {
	rest.Server
	store Store
}

type AreaJson struct {
	Name         string `json:"name"`
	CurriculumId string `json:"curriculumId"`
}

type SubjectJson struct {
	Name   string `json:"name"`
	AreaId string `json:"areaId"`
}

func NewRouter(s rest.Server, store Store) *chi.Mux {
	server := server{s, store}
	r := chi.NewRouter()
	r.Method("POST", "/areas", server.createArea())
	r.Method("GET", "/areas/{areaId}", server.getArea())
	r.Method("GET", "/areas/{areaId}/subjects", server.getAreaSubjects())
	r.Method("POST", "/areas/{areaId}/subjects", server.createSubject())

	r.Method("PATCH", "/subjects/{subjectId}", server.updateSubject())
	r.Method("GET", "/subjects/{subjectId}/materials", server.getSubjectMaterials())
	return r
}

func (s *server) getArea() rest.Handler {
	type responseBody struct {
		Id   string `json:"id"`
		Name string `json:"name"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		areaId := chi.URLParam(r, "areaId")

		// Get area
		area, err := s.store.GetArea(areaId)
		if err != nil {
			return &rest.Error{http.StatusNotFound, " Can't find area with specified ID", err}
		}

		// Write response
		response := responseBody{area.Id, area.Name}
		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func (s *server) getAreaSubjects() rest.Handler {
	type simplifiedSubject struct {
		Id    string `json:"id"`
		Name  string `json:"name"`
		Order int    `json:"order"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		areaId := chi.URLParam(r, "areaId")

		subjects, err := s.store.GetAreaSubjects(areaId)
		if err != nil {
			return &rest.Error{http.StatusNotFound, " Can't find subject with specified area ID", err}
		}

		// Write response
		var response []simplifiedSubject
		for _, subject := range subjects {
			response = append(response, simplifiedSubject{
				Id:    subject.Id,
				Name:  subject.Name,
				Order: subject.Order,
			})
		}
		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func (s *server) createArea() rest.Handler {
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		var requestBody AreaJson
		if err := rest.ParseJson(r.Body, &requestBody); err != nil {
			return rest.NewParseJsonError(err)
		}
		if _, err := uuid.Parse(requestBody.CurriculumId); err != nil {
			return &rest.Error{http.StatusBadRequest, "Invalid curriculum ID", err}
		}

		if requestBody.CurriculumId == "" {
			return &rest.Error{http.StatusBadRequest, "Curriculum ID is required", errors.New("empty curriculum ID")}
		}
		if requestBody.Name == "" {
			return &rest.Error{http.StatusBadRequest, "Area needs a name", errors.New("empty area name")}
		}

		areaId, err := s.store.NewArea(requestBody.Name, requestBody.CurriculumId)
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed saving area", err}
		}
		w.WriteHeader(http.StatusCreated)
		w.Header().Add("Location", r.URL.Path+"/"+areaId)
		return nil
	})
}

func (s *server) createSubject() http.Handler {
	type requestBody struct {
		Name string `json:"name"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		areaId := chi.URLParam(r, "areaId")

		var requestBody requestBody
		if err := rest.ParseJson(r.Body, &requestBody); err != nil {
			return rest.NewParseJsonError(err)
		}

		if requestBody.Name == "" {
			return &rest.Error{http.StatusBadRequest, "Name cannot be empty", richErrors.New("name can't be empty")}
		}

		subject, err := s.store.NewSubject(requestBody.Name, areaId)
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed saving subject", err}
		}

		w.WriteHeader(http.StatusCreated)
		w.Header().Add("Location", r.URL.Path+"/"+subject.Id)
		return nil
	})
}

func (s *server) updateSubject() http.Handler {
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		var requestBody SubjectJson
		if err := rest.ParseJson(r.Body, &requestBody); err != nil {
			return rest.NewParseJsonError(err)
		}

		subjectId := chi.URLParam(r, "subjectId")
		subject, err := s.store.GetSubject(subjectId)
		if err == pg.ErrNoRows {
			return &rest.Error{http.StatusConflict, "Subject with specified ID does not exist", err}
		} else if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed getting subject from db", err}
		}

		if requestBody.Name != "" {
			subject.Name = requestBody.Name
		}
		if requestBody.AreaId != "" {
			_, err := s.store.GetArea(requestBody.AreaId)
			if err == pg.ErrNoRows {
				return &rest.Error{http.StatusUnprocessableEntity, "Area ID does not exist", err}
			} else if err != nil {
				return &rest.Error{http.StatusUnprocessableEntity, "Invalid area.", err}
			}
			subject.AreaId = requestBody.AreaId
		}
		if err := s.store.UpdateSubject(subject); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed saving updated subject", err}
		}

		w.WriteHeader(http.StatusNoContent)
		return nil
	})
}

func (s *server) getSubjectMaterials() rest.Handler {
	type simplifiedMaterial struct {
		Id    string `json:"id"`
		Name  string `json:"name"`
		Order int    `json:"order"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		subjectId := chi.URLParam(r, "subjectId")

		materials, err := s.store.GetSubjectMaterials(subjectId)
		if err != nil {
			return &rest.Error{http.StatusNotFound, " Can't find materials with the specified subject id", err}
		}

		// Write response
		var response []simplifiedMaterial
		for _, subject := range materials {
			response = append(response, simplifiedMaterial{
				Id:    subject.Id,
				Name:  subject.Name,
				Order: subject.Order,
			})
		}
		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}
