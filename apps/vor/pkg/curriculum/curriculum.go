package curriculum

import (
	"errors"
	"github.com/chrsep/vor/pkg/domain"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-pg/pg/v10"
	"github.com/google/uuid"
	richErrors "github.com/pkg/errors"

	"github.com/chrsep/vor/pkg/rest"
)

func NewRouter(server rest.Server, store Store) *chi.Mux {
	r := chi.NewRouter()

	r.Route("/{curriculumId}", func(r chi.Router) {
		r.Use(curriculumAuthMiddleware(server, store))
		r.Method("PATCH", "/", patchCurriculum(server, store))
		r.Method("POST", "/areas", createArea(server, store))
	})

	r.Route("/areas/{areaId}", func(r chi.Router) {
		r.Use(areaAuthMiddleware(server, store))
		r.Method("PATCH", "/", patchArea(server, store))
		r.Method("GET", "/", getArea(server, store))
		r.Method("DELETE", "/", deleteArea(server, store))
		r.Method("GET", "/subjects", getAreaSubjects(server, store))
		r.Method("POST", "/subjects", createSubject(server, store))
	})

	r.Route("/subjects/{subjectId}", func(r chi.Router) {
		r.Use(subjectAuthMiddleware(server, store))
		r.Method("GET", "/", getSubject(server, store))
		r.Method("PUT", "/", replaceSubject(server, store))
		r.Method("DELETE", "/", deleteSubject(server, store))
		r.Method("PATCH", "/", patchSubject(server, store))
		r.Method("GET", "/materials", getSubjectMaterials(server, store))
		r.Method("POST", "/materials", createNewMaterial(server, store))
	})

	r.Route("/materials/{materialId}", func(r chi.Router) {
		r.Use(materialAuthMiddleware(server, store))
		r.Method("DELETE", "/", deleteMaterial(server, store))
		r.Method("PATCH", "/", patchMaterial(server, store))
		r.Method("GET", "/", getMaterial(server, store))
	})

	return r
}

func deleteMaterial(server rest.Server, store Store) http.Handler {
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		materialId := chi.URLParam(r, "materialId")

		if err := store.DeleteMaterial(materialId); err != nil {
			return &rest.Error{
				Code:    http.StatusNotFound,
				Message: "can't find the given material",
				Error:   err,
			}
		}

		return nil
	})
}

func patchSubject(server rest.Server, store Store) http.Handler {
	type requestBody struct {
		Name        *string    `json:"name"`
		Order       *int       `json:"order"`
		AreaId      *uuid.UUID `json:"areaId"`
		Description *string    `json:"description"`
	}
	type responseBody struct {
		Id          string `json:"id"`
		Order       int    `json:"order"`
		Description string `json:"description"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		subjectId := chi.URLParam(r, "subjectId")

		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}

		// Validate material name
		if body.Name != nil {
			if *body.Name == "" {
				return &rest.Error{
					Code:    http.StatusUnprocessableEntity,
					Message: "Name can't be empty",
					Error:   errors.New("empty name field"),
				}
			}
		}

		// Validate subject ID
		if body.AreaId != nil {
			_, err := store.GetSubject(body.AreaId.String())
			if err == pg.ErrNoRows {
				return &rest.Error{
					Code:    http.StatusUnprocessableEntity,
					Message: "Can't find the specified subject",
					Error:   errors.New("empty name field"),
				}
			} else if err != nil {
				return &rest.Error{
					Code:    http.StatusInternalServerError,
					Message: "Can' retrieve subject",
					Error:   err,
				}
			}
		}

		subject, err := store.UpdateSubject(subjectId, body.Name, body.Order, body.Description, body.AreaId)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "Failed updating material",
				Error:   err,
			}
		}

		response := responseBody{
			Id:          subject.Id,
			Order:       subject.Order,
			Description: subject.Description,
		}
		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func getMaterial(s rest.Server, store Store) http.Handler {
	type responseBody struct {
		Id          string `json:"id"`
		Name        string `json:"name"`
		Description string `json:"description"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		materialId := chi.URLParam(r, "materialId")

		material, err := store.GetMaterial(materialId)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "failed to query material data",
				Error:   err,
			}
		}

		response := responseBody{
			Id:          material.Id,
			Name:        material.Name,
			Description: material.Description,
		}
		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewParseJsonError(err)
		}

		return nil
	})
}

func patchCurriculum(s rest.Server, store Store) rest.Handler {
	type responseBody struct {
		Id          string `json:"id"`
		Name        string `json:"name"`
		Description string `json:"description"`
	}
	type requestBody struct {
		Name        *string `json:"name"`
		Description *string `json:"description"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		curriculumId := chi.URLParam(r, "curriculumId")

		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}

		curriculum, err := store.UpdateCurriculum(curriculumId, body.Name, body.Description)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "failed to update curriculum",
				Error:   err,
			}
		}

		if err := rest.WriteJson(w, &responseBody{Id: curriculum.Id, Name: curriculum.Name}); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func getArea(server rest.Server, store Store) rest.Handler {
	type responseBody struct {
		Id          string `json:"id"`
		Name        string `json:"name"`
		Description string `json:"description"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		areaId := chi.URLParam(r, "areaId")

		// Get area
		area, err := store.GetArea(areaId)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusNotFound,
				Message: " Can't find area with specified ID",
				Error:   err,
			}
		}

		// Write response
		response := responseBody{
			Id:          area.Id,
			Name:        area.Name,
			Description: area.Description,
		}
		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func getAreaSubjects(server rest.Server, store Store) rest.Handler {
	type simplifiedSubject struct {
		Id          string `json:"id"`
		Name        string `json:"name"`
		Order       int    `json:"order"`
		Description string `json:"description"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		areaId := chi.URLParam(r, "areaId")

		subjects, err := store.GetAreaSubjects(areaId)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusNotFound,
				Message: " Can't find subject with specified area ID",
				Error:   err,
			}
		}

		// Write response
		response := make([]simplifiedSubject, 0)
		for _, subject := range subjects {
			response = append(response, simplifiedSubject{
				Id:          subject.Id,
				Name:        subject.Name,
				Order:       subject.Order,
				Description: subject.Description,
			})
		}
		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func createArea(server rest.Server, store Store) rest.Handler {
	type requestBody struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}
	type responseBody struct {
		Id          string `json:"id"`
		Name        string `json:"name"`
		Description string `json:"description"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		curriculumId := chi.URLParam(r, "curriculumId")
		if _, err := uuid.Parse(curriculumId); err != nil {
			return &rest.Error{
				Code:    http.StatusBadRequest,
				Message: "Invalid curriculum ID",
				Error:   err,
			}
		}

		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}

		if curriculumId == "" {
			return &rest.Error{
				Code:    http.StatusBadRequest,
				Message: "Curriculum ID is required",
				Error:   errors.New("empty curriculum ID"),
			}
		}
		if body.Name == "" {
			return &rest.Error{
				Code:    http.StatusBadRequest,
				Message: "Area needs a name",
				Error:   errors.New("empty area name"),
			}
		}

		area, err := store.NewArea(curriculumId, body.Name, body.Description)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "Failed saving area",
				Error:   err,
			}
		}

		w.WriteHeader(http.StatusCreated)
		if err = rest.WriteJson(w, &responseBody{
			Id:          area.Id,
			Name:        area.Name,
			Description: area.Description,
		}); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func createSubject(server rest.Server, store Store) http.Handler {
	type requestBody struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		Materials   []struct {
			Name        string `json:"name"`
			Order       int    `json:"order"`
			Description string `json:"description"`
		} `json:"materials"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		areaId := chi.URLParam(r, "areaId")

		// Parse request
		var requestBody requestBody
		if err := rest.ParseJson(r.Body, &requestBody); err != nil {
			return rest.NewParseJsonError(err)
		}
		if requestBody.Name == "" {
			return &rest.Error{
				Code:    http.StatusBadRequest,
				Message: "Name cannot be empty",
				Error:   richErrors.New("name can't be empty"),
			}
		}

		// Convert Material into proper form
		var materials []domain.Material
		orderingNumbers := make(map[int]bool)
		for _, material := range requestBody.Materials {
			// For checking duplicated order later
			orderingNumbers[material.Order] = true

			materials = append(materials, domain.Material{
				Id:    uuid.New().String(),
				Name:  material.Name,
				Order: material.Order,
			})
		}
		// Make sure no order number is repeated.
		if len(orderingNumbers) != len(materials) {
			return &rest.Error{
				Code:    http.StatusUnprocessableEntity,
				Message: "Material order number can't be repeated",
				Error:   richErrors.New("Repeated order number in list of materials")}
		}
		subject, err := store.NewSubject(requestBody.Name, areaId, materials, requestBody.Description)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "Failed saving subject",
				Error:   err,
			}
		}

		w.WriteHeader(http.StatusCreated)
		w.Header().Add("Location", r.URL.Path+"/"+subject.Id)
		return nil
	})
}

func getSubjectMaterials(server rest.Server, store Store) rest.Handler {
	type responseBody struct {
		Id          string `json:"id"`
		Name        string `json:"name"`
		Order       int    `json:"order"`
		Description string `json:"description"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		subjectId := chi.URLParam(r, "subjectId")

		materials, err := store.GetSubjectMaterials(subjectId)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusNotFound,
				Message: " Can't find materials with the specified subject id",
				Error:   err,
			}
		}

		// Write response
		response := make([]responseBody, 0)
		for _, m := range materials {
			response = append(response, responseBody{
				Id:          m.Id,
				Name:        m.Name,
				Order:       m.Order,
				Description: m.Description,
			})
		}
		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func createNewMaterial(server rest.Server, store Store) http.Handler {
	type requestBody struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		// Parse body, make sure it's valid
		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}
		if body.Name == "" {
			return &rest.Error{
				Code:    http.StatusUnprocessableEntity,
				Message: "Name can't be empty",
				Error:   errors.New("empty name field"),
			}
		}

		// Make sure subject id is valid (better as middleware)
		subjectId := chi.URLParam(r, "subjectId")
		if _, err := uuid.Parse(subjectId); err != nil {
			return &rest.Error{
				Code:    http.StatusNotFound,
				Message: "Can't find the specified subject",
				Error:   err,
			}
		}

		// Make sure subject exists
		subject, err := store.GetSubject(subjectId)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "Failed retrieving subject",
				Error:   err,
			}
		}

		// Create and save the requested material (default order is on the bottom of list.
		material, err := store.NewMaterial(subject.Id, body.Name, body.Description)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "Failed saving new material",
				Error:   err,
			}
		}

		w.Header().Add("Location", r.URL.Path+"/"+material.Id)
		w.WriteHeader(http.StatusCreated)
		return nil
	})
}

func patchMaterial(server rest.Server, store Store) http.Handler {
	type requestBody struct {
		Name        *string    `json:"name"`
		Order       *int       `json:"order"`
		SubjectId   *uuid.UUID `json:"subjectId"`
		Description *string    `json:"description"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		materialId := chi.URLParam(r, "materialId")

		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}

		// Validate material name
		if body.Name != nil {
			if *body.Name == "" {
				return &rest.Error{
					Code:    http.StatusUnprocessableEntity,
					Message: "Name can't be empty",
					Error:   errors.New("empty name field"),
				}
			}
		}

		// Validate subject ID
		if body.SubjectId != nil {
			_, err := store.GetSubject(body.SubjectId.String())
			if err == pg.ErrNoRows {
				return &rest.Error{
					Code:    http.StatusUnprocessableEntity,
					Message: "Can't find the specified subject",
					Error:   errors.New("empty name field"),
				}
			} else if err != nil {
				return &rest.Error{
					Code:    http.StatusInternalServerError,
					Message: "Can' retrieve subject",
					Error:   err,
				}
			}
		}

		if err := store.UpdateMaterial(materialId, body.Name, body.Order, body.Description, body.SubjectId); err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "Failed updating material",
				Error:   err,
			}
		}
		w.WriteHeader(http.StatusNoContent)
		return nil
	})
}

func deleteSubject(server rest.Server, store Store) http.Handler {
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		subjectId := chi.URLParam(r, "subjectId")

		if err := store.DeleteSubject(subjectId); err != nil {
			return &rest.Error{
				Code:    http.StatusNotFound,
				Message: "Can't find the specified subject",
				Error:   err,
			}
		}
		return nil
	})
}

func deleteArea(server rest.Server, store Store) http.Handler {
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		areaId := chi.URLParam(r, "areaId")

		if err := store.DeleteArea(areaId); err != nil {
			return &rest.Error{
				Code:    http.StatusNotFound,
				Message: "Can't find the specified subject",
				Error:   err,
			}
		}

		return nil
	})
}

func replaceSubject(server rest.Server, store Store) http.Handler {
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
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		subjectId := chi.URLParam(r, "subjectId")
		// Parse Body
		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}

		// Validate that request body is valid
		if body.Name == "" {
			return &rest.Error{
				Code:    http.StatusBadRequest,
				Message: "Name cannot be empty",
				Error:   richErrors.New("empty subject name"),
			}
		}
		newSubject := domain.Subject{
			Id:        subjectId,
			AreaId:    body.AreaId,
			Name:      body.Name,
			Materials: make([]domain.Material, 0),
			Order:     body.Order,
		}
		materialOrderNumbers := make(map[int]bool)
		for _, material := range body.Materials {
			if material.Name == "" {
				return &rest.Error{
					Code:    http.StatusBadRequest,
					Message: "Material name cannot be empty",
					Error:   richErrors.New("empty material name"),
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
			newSubject.Materials = append(newSubject.Materials, domain.Material{
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
				Code:    http.StatusBadRequest,
				Message: "Material order number can't be repeated",
				Error:   richErrors.New("Repeated order number"),
			}
		}

		// Make sure area referenced exists
		_, err := store.GetArea(body.AreaId)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusBadRequest,
				Message: "Can't find the specified area",
				Error:   err,
			}
		}

		// Replace subject
		if err := store.ReplaceSubject(newSubject); err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "Failed replacing subject",
				Error:   err,
			}
		}
		return nil
	})
}

func patchArea(server rest.Server, store Store) http.Handler {
	type requestBody struct {
		Name string `json:"name"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		areaId := chi.URLParam(r, "areaId")

		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}
		if body.Name == "" {
			return &rest.Error{
				Code:    http.StatusBadRequest,
				Message: "Name can't be empty",
				Error:   richErrors.New("Empty name field"),
			}
		}

		if err := store.UpdateArea(areaId, body.Name); err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "Failed updating area",
				Error:   err,
			}
		}

		return nil
	})
}

func getSubject(server rest.Server, store Store) http.Handler {
	type responseBody struct {
		Id    string `json:"id"`
		Name  string `json:"name"`
		Order int    `json:"order"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		subjectId := chi.URLParam(r, "subjectId")

		subject, err := store.GetSubject(subjectId)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusNotFound,
				Message: " Can't find subject with specified area ID",
				Error:   err,
			}
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
