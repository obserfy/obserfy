package main

import (
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"net/http"
)

func createCurriculumSubroute(env Env) *chi.Mux {
	r := chi.NewRouter()
	r.Method("GET", "/areas/{areaId}", getArea(env))
	r.Method("GET", "/areas/{areaId}/subjects", getAreaSubjects(env))
	r.Method("GET", "/subjects/{subjectId}/materials", getSubjectMaterials(env))
	return r
}

func getArea(env Env) rest.Handler {
	type responseBody struct {
		Id   string `json:"id"`
		Name string `json:"name"`
	}
	return rest.Handler{env.logger, func(w http.ResponseWriter, r *http.Request) *rest.Error {
		areaId := chi.URLParam(r, "areaId")

		// Get area
		var dbArea postgres.Area
		if err := env.db.Model(&dbArea).
			Column("id", "name").
			Where("id=?", areaId).
			Select(); err != nil {
			return &rest.Error{http.StatusNotFound, " Can't find area with specified ID", err}
		}

		// Write response
		response := responseBody{
			Id:   dbArea.Id,
			Name: dbArea.Name,
		}
		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	}}
}

func getAreaSubjects(env Env) rest.Handler {
	type simplifiedSubject struct {
		Id    string `json:"id"`
		Name  string `json:"name"`
		Order int    `json:"order"`
	}
	return rest.Handler{env.logger, func(w http.ResponseWriter, r *http.Request) *rest.Error {
		areaId := chi.URLParam(r, "areaId")

		var subjects []postgres.Subject
		if err := env.db.Model(&subjects).
			Where("area_id=?", areaId).
			Select(); err != nil {
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
	}}
}

func getSubjectMaterials(env Env) rest.Handler {
	type simplifiedMaterial struct {
		Id    string `json:"id"`
		Name  string `json:"name"`
		Order int    `json:"order"`
	}
	return rest.Handler{env.logger, func(w http.ResponseWriter, r *http.Request) *rest.Error {
		subjectId := chi.URLParam(r, "subjectId")

		var materials []postgres.Material
		if err := env.db.Model(&materials).
			Where("subject_id=?", subjectId).
			Select(); err != nil {
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
	}}
}
