package curriculum

import (
	"errors"
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
		r.Method("GET", "/materials", getSubjectMaterials(server, store))
		r.Method("POST", "/materials", createNewMaterial(server, store))
	})

	r.Route("/materials/{materialId}", func(r chi.Router) {
		r.Use(materialAuthMiddleware(server, store))
		r.Method("PATCH", "/", updateMaterial(server, store))
	})

	return r
}

func getArea(server rest.Server, store Store) rest.Handler {
	type responseBody struct {
		Id   string `json:"id"`
		Name string `json:"name"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		areaId := chi.URLParam(r, "areaId")

		// Get area
		area, err := store.GetArea(areaId)
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

func getAreaSubjects(server rest.Server, store Store) rest.Handler {
	type simplifiedSubject struct {
		Id    string `json:"id"`
		Name  string `json:"name"`
		Order int    `json:"order"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		areaId := chi.URLParam(r, "areaId")

		subjects, err := store.GetAreaSubjects(areaId)
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

func createArea(server rest.Server, store Store) rest.Handler {
	type requestBody struct {
		Name string `json:"name"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		curriculumId := chi.URLParam(r, "curriculumId")
		if _, err := uuid.Parse(curriculumId); err != nil {
			return &rest.Error{
				http.StatusBadRequest,
				"Invalid curriculum ID",
				err,
			}
		}

		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}

		if curriculumId == "" {
			return &rest.Error{
				http.StatusBadRequest,
				"Curriculum ID is required",
				errors.New("empty curriculum ID"),
			}
		}
		if body.Name == "" {
			return &rest.Error{
				http.StatusBadRequest,
				"Area needs a name",
				errors.New("empty area name"),
			}
		}

		areaId, err := store.NewArea(body.Name, curriculumId)
		if err != nil {
			return &rest.Error{
				http.StatusInternalServerError,
				"Failed saving area",
				err,
			}
		}
		w.WriteHeader(http.StatusCreated)
		w.Header().Add("Location", r.URL.Path+"/"+areaId)
		return nil
	})
}

func createSubject(server rest.Server, store Store) http.Handler {
	type requestBody struct {
		Name      string `json:"name"`
		Materials []struct {
			Name  string `json:"name"`
			Order int    `json:"order"`
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
			return &rest.Error{http.StatusBadRequest, "Name cannot be empty", richErrors.New("name can't be empty")}
		}

		// Convert Material into proper form
		var materials []Material
		orderingNumbers := make(map[int]bool)
		for _, material := range requestBody.Materials {
			// For checking duplicated order later
			orderingNumbers[material.Order] = true

			materials = append(materials, Material{
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
		subject, err := store.NewSubject(requestBody.Name, areaId, materials)
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed saving subject", err}
		}

		w.WriteHeader(http.StatusCreated)
		w.Header().Add("Location", r.URL.Path+"/"+subject.Id)
		return nil
	})
}

func getSubjectMaterials(server rest.Server, store Store) rest.Handler {
	type responseBody struct {
		Id    string `json:"id"`
		Name  string `json:"name"`
		Order int    `json:"order"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		subjectId := chi.URLParam(r, "subjectId")

		materials, err := store.GetSubjectMaterials(subjectId)
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

func createNewMaterial(server rest.Server, store Store) http.Handler {
	type requestBody struct {
		Name string `json:"name"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
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
		subject, err := store.GetSubject(subjectId)
		if err == pg.ErrNoRows {
			return &rest.Error{http.StatusNotFound, "Can't find the specified subject", err}
		} else if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed retrieving subject", err}
		}

		// Create and save the requested material (default order is on the bottom of list.
		material, err := store.NewMaterial(body.Name, subject.Id)
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed saving new material", err}
		}

		w.Header().Add("Location", r.URL.Path+"/"+material.Id)
		w.WriteHeader(http.StatusCreated)
		return nil
	})
}

func updateMaterial(server rest.Server, store Store) http.Handler {
	type requestBody struct {
		Name      *string `json:"name"`
		Order     *int    `json:"order"`
		SubjectId *string `json:"subjectId"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}

		// Validate targeted material
		materialId := chi.URLParam(r, "materialId")
		material, err := store.GetMaterial(materialId)
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
			subject, err := store.GetSubject(*body.SubjectId)
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

		if err := store.UpdateMaterial(material, newOrder); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed updating material", err}
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
				http.StatusNotFound,
				"Can't find the specified subject",
				err,
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
				http.StatusNotFound,
				"Can't find the specified subject",
				err,
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
				http.StatusBadRequest,
				"Name cannot be empty",
				richErrors.New("empty subject name"),
			}
		}
		newSubject := Subject{
			Id:        subjectId,
			AreaId:    body.AreaId,
			Name:      body.Name,
			Materials: make([]Material, 0),
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
			newSubject.Materials = append(newSubject.Materials, Material{
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
		_, err := store.GetArea(body.AreaId)
		if err != nil {
			return &rest.Error{
				http.StatusBadRequest,
				"Can't find the specified area",
				err,
			}
		}

		// Replace subject
		if err := store.ReplaceSubject(newSubject); err != nil {
			return &rest.Error{
				http.StatusInternalServerError,
				"Failed replacing subject",
				err,
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
				http.StatusBadRequest,
				"Name can't be empty",
				richErrors.New("Empty name field"),
			}
		}

		if err := store.UpdateArea(areaId, body.Name); err != nil {
			return &rest.Error{
				http.StatusInternalServerError,
				"Failed updating area",
				err,
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
