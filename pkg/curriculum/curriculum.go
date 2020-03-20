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
	GetMaterial(materialId string) (*postgres.Material, error)
	NewArea(name string, curriculumId string) (string, error)
	NewSubject(name string, areaId string, materials []postgres.Material) (*postgres.Subject, error)
	NewMaterial(name string, subjectId string) (*postgres.Material, error)
	GetSubject(id string) (*postgres.Subject, error)
	UpdateSubject(subject *postgres.Subject) error
	UpdateMaterial(material *postgres.Material, order *int) error
	DeleteArea(id string) error
	DeleteSubject(id string) error
	ReplaceSubject(subject postgres.Subject) error
	UpdateArea(areaId string, name string) error
}

type server struct {
	rest.Server
	store Store
}

// TODO: Consider removing AreaJson and SubjectJson. It complicates things.
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
	r.Method("PATCH", "/areas/{areaId}", server.patchArea())
	r.Method("GET", "/areas/{areaId}", server.getArea())
	r.Method("DELETE", "/areas/{areaId}", server.deleteArea())
	r.Method("GET", "/areas/{areaId}/subjects", server.getAreaSubjects())
	r.Method("POST", "/areas/{areaId}/subjects", server.createSubject())

	r.Method("GET", "/subjects/{subjectId}", server.getSubject())
	r.Method("PUT", "/subjects/{subjectId}", server.replaceSubject())
	// TODO: This is not used, refactor after curriculum got e2e test.
	r.Method("PATCH", "/subjects/{subjectId}", server.updateSubject())
	r.Method("DELETE", "/subjects/{subjectId}", server.deleteSubject())
	r.Method("GET", "/subjects/{subjectId}/materials", server.getSubjectMaterials())
	r.Method("POST", "/subjects/{subjectId}/materials", server.createNewMaterial())

	r.Method("PATCH", "/materials/{materialId}", server.updateMaterial())
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
		Name      string `json:"name"`
		Materials []struct {
			Name  string `json:"name"`
			Order int    `json:"order"`
		} `json:"materials"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		areaId := chi.URLParam(r, "areaId")

		// Parse request
		var requestBody requestBody
		if err := rest.ParseJson(r.Body, &requestBody); err != nil {
			return rest.NewParseJsonError(err)
		}
		if requestBody.Name == "" {
			return &rest.Error{http.StatusBadRequest, "Name cannot be empty", richErrors.New("name can't be empty")}
		}

		// Convert Material into proper form
		var materials []postgres.Material
		orderingNumbers := make(map[int]bool)
		for _, material := range requestBody.Materials {
			// For checking duplicated order later
			orderingNumbers[material.Order] = true

			materials = append(materials, postgres.Material{
				Id:    uuid.New().String(),
				Name:  material.Name,
				Order: material.Order,
			})
		}
		// Make sure no order number is repeated.
		if len(orderingNumbers) != len(materials) {
			return &rest.Error{
				http.StatusUnprocessableEntity,
				"Material order number can't be repeated",
				richErrors.New("Repeatd order number in list of materials")}
		}
		subject, err := s.store.NewSubject(requestBody.Name, areaId, materials)
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
	type responseBody struct {
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
		var response []responseBody
		for _, subject := range materials {
			response = append(response, responseBody{
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

func (s *server) createNewMaterial() http.Handler {
	type requestBody struct {
		Name string `json:"name"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		// Parse body, make sure it's valid
		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}
		if body.Name == "" {
			return &rest.Error{
				http.StatusUnprocessableEntity,
				"Name can't be empty",
				errors.New("empty name field"),
			}
		}

		// Make sure subject id is valid (better as middleware)
		subjectId := chi.URLParam(r, "subjectId")
		if _, err := uuid.Parse(subjectId); err != nil {
			return &rest.Error{http.StatusNotFound, "Can't find the specified subject", err}
		}

		// Make sure subject exists
		subject, err := s.store.GetSubject(subjectId)
		if err == pg.ErrNoRows {
			return &rest.Error{http.StatusNotFound, "Can't find the specified subject", err}
		} else if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed retrieving subject", err}
		}

		// Create and save the requested material (default order is on the bottom of list.
		material, err := s.store.NewMaterial(body.Name, subject.Id)
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed saving new material", err}
		}

		w.Header().Add("Location", r.URL.Path+"/"+material.Id)
		w.WriteHeader(http.StatusCreated)
		return nil
	})
}

func (s *server) updateMaterial() http.Handler {
	type requestBody struct {
		Name      *string `json:"name"`
		Order     *int    `json:"order"`
		SubjectId *string `json:"subjectId"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}

		// Validate targeted material
		materialId := chi.URLParam(r, "materialId")
		material, err := s.store.GetMaterial(materialId)
		if err == pg.ErrNoRows {
			return &rest.Error{http.StatusNotFound, "Can' find material with the specified ID", err}
		} else if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Can' retrieve material", err}
		}

		// Validate material name
		if body.Name != nil {
			if *body.Name == "" {
				return &rest.Error{http.StatusUnprocessableEntity, "Name can't be empty", errors.New("empty name field")}
			}
			material.Name = *body.Name
		}

		// Validate subject ID
		if body.SubjectId != nil {
			if _, err := uuid.Parse(*body.SubjectId); err != nil {
				return &rest.Error{http.StatusUnprocessableEntity, "Can't find the specified subject", errors.New("empty name field")}
			}
			subject, err := s.store.GetSubject(*body.SubjectId)
			if err == pg.ErrNoRows {
				return &rest.Error{http.StatusUnprocessableEntity, "Can't find the specified subject", errors.New("empty name field")}
			} else if err != nil {
				return &rest.Error{http.StatusInternalServerError, "Can' retrieve subject", err}
			} else {
				material.SubjectId = subject.Id
			}
		}

		var newOrder *int
		if body.Order != nil {
			newOrder = body.Order
		}

		if err := s.store.UpdateMaterial(material, newOrder); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed updating material", err}
		}
		w.WriteHeader(http.StatusNoContent)
		return nil
	})
}

func (s *server) deleteSubject() http.Handler {
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		subjectId := chi.URLParam(r, "subjectId")

		if err := s.store.DeleteSubject(subjectId); err != nil {
			return &rest.Error{
				http.StatusNotFound,
				"Can't find the specified subject",
				err,
			}
		}
		return nil
	})
}

func (s *server) deleteArea() http.Handler {
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		areaId := chi.URLParam(r, "areaId")

		if err := s.store.DeleteArea(areaId); err != nil {
			return &rest.Error{
				http.StatusNotFound,
				"Can't find the specified subject",
				err,
			}
		}

		return nil
	})
}

func (s *server) replaceSubject() http.Handler {
	type requestBody struct {
		Name      string `json:"name"`
		Order     int    `json:"order"`
		AreaId    string `json:"areaId"`
		Materials []struct {
			Id    string `json:"id"`
			Name  string `json:"name"`
			Order int    `json:"order"`
		} `json:"materials"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		subjectId := chi.URLParam(r, "subjectId")
		// Parse Body
		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}

		// Validate that request body is valid
		if body.Name == "" {
			return &rest.Error{
				http.StatusBadRequest,
				"Name cannot be empty",
				richErrors.New("empty subject name"),
			}
		}
		newSubject := postgres.Subject{
			Id:        subjectId,
			AreaId:    body.AreaId,
			Name:      body.Name,
			Materials: make([]postgres.Material, 0),
			Order:     body.Order,
		}
		materialOrderNumbers := make(map[int]bool)
		for _, material := range body.Materials {
			if material.Name == "" {
				return &rest.Error{
					http.StatusBadRequest,
					"Material name cannot be empty",
					richErrors.New("empty material name"),
				}
			}
			// Validate that the id is a valid uuid since we get this from client
			// If its invalid (which probably means that the client had created a new material,
			// and assign some random ID to it), we give it a new uuid so it can be save by postgres.
			// TODO: May be its better to use go-pg's type:uuid default uuid_generate_v4() instead of
			// 	generating ids our-self most of the time.
			if _, err := uuid.Parse(material.Id); err != nil {
				material.Id = uuid.New().String()
			}
			newSubject.Materials = append(newSubject.Materials, postgres.Material{
				Id:        material.Id,
				SubjectId: subjectId,
				Subject:   newSubject,
				Name:      material.Name,
				Order:     material.Order,
			})
			materialOrderNumbers[material.Order] = true
		}
		// Make sure no order are repeated
		if len(materialOrderNumbers) != len(body.Materials) {
			return &rest.Error{
				http.StatusBadRequest,
				"Material order number can't be repeated",
				richErrors.New("Repeated order number"),
			}
		}

		// Make sure area referenced exists
		_, err := s.store.GetArea(body.AreaId)
		if err != nil {
			return &rest.Error{
				http.StatusBadRequest,
				"Can't find the specified area",
				err,
			}
		}

		// Replace subject
		if err := s.store.ReplaceSubject(newSubject); err != nil {
			return &rest.Error{
				http.StatusInternalServerError,
				"Failed replacing subject",
				err,
			}
		}
		return nil
	})
}

func (s *server) patchArea() http.Handler {
	type requestBody struct {
		Name string `json:"name"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		areaId := chi.URLParam(r, "areaId")

		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}
		if body.Name == "" {
			return &rest.Error{
				http.StatusBadRequest,
				"Name can't be empty",
				richErrors.New("Empty name field"),
			}
		}

		if err := s.store.UpdateArea(areaId, body.Name); err != nil {
			return &rest.Error{
				http.StatusInternalServerError,
				"Failed updating area",
				err,
			}
		}

		return nil
	})
}

func (s *server) getSubject() http.Handler {
	type responseBody struct {
		Id    string `json:"id"`
		Name  string `json:"name"`
		Order int    `json:"order"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		subjectId := chi.URLParam(r, "subjectId")

		subject, err := s.store.GetSubject(subjectId)
		if err != nil {
			return &rest.Error{http.StatusNotFound, " Can't find subject with specified area ID", err}
		}

		// Write response
		response := responseBody{
			Id:    subject.Id,
			Name:  subject.Name,
			Order: subject.Order,
		}

		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}
