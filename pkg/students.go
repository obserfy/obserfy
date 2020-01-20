package main

import (
	"github.com/go-chi/chi"
	"github.com/google/uuid"
	"net/http"
	"time"
)

type Student struct {
	Id          string `json:"id" pg:",type:uuid"`
	Name        string `json:"name"`
	SchoolId    string `pg:"type:uuid,on_delete:CASCADE"`
	School      School
	DateOfBirth *time.Time
}

func createStudentsSubroute(env Env) *chi.Mux {
	r := chi.NewRouter()
	r.Method("GET", "/{id}", getStudentById(env))
	r.Method("DELETE", "/{id}", deleteStudent(env))
	r.Method("PUT", "/{id}", replaceStudent(env))

	r.Method("POST", "/{id}/observations", addObservationToStudent(env))
	r.Method("GET", "/{id}/observations", getAllStudentObservations(env))

	r.Method("GET", "/{id}/materialsProgress", getStudentProgress(env))
	r.Method("PATCH", "/{id}/materialsProgress/{materialId}", updateMaterialProgress(env))
	return r
}

func deleteStudent(env Env) AppHandler {
	return AppHandler{env, func(w http.ResponseWriter, r *http.Request) *HTTPError {
		deletedId := chi.URLParam(r, "id") // from a route like /users/{userID}
		student := Student{Id: deletedId}
		if err := env.db.Delete(&student); err != nil {
			return &HTTPError{http.StatusInternalServerError, "Failed deleting student", err}
		}
		return nil
	}}
}

func replaceStudent(env Env) AppHandler {
	type requestBody struct {
		Name        string     `json:"name"`
		DateOfBirth *time.Time `json:"dateOfBirth"`
	}
	type responseBody struct {
		Id          string     `json:"id"`
		Name        string     `json:"name"`
		DateOfBirth *time.Time `json:"dateOfBirth,omitempty"`
	}
	return AppHandler{env, func(w http.ResponseWriter, r *http.Request) *HTTPError {
		targetId := chi.URLParam(r, "id") // from a route like /users/{userID}

		var requestBody requestBody
		if err := parseJson(r.Body, &requestBody); err != nil {
			return createParseJsonError(err)
		}

		var oldStudent Student
		if err := env.db.Model(&oldStudent).
			Where("id=?", targetId).
			Select(); err != nil {
			return &HTTPError{http.StatusNotFound, "Can't find old student data", err}
		}

		newStudent := oldStudent
		newStudent.Name = requestBody.Name
		newStudent.DateOfBirth = requestBody.DateOfBirth
		if err := env.db.Update(&newStudent); err != nil {
			return &HTTPError{http.StatusInternalServerError, "Failed updating old student data", err}
		}

		response := responseBody{
			Id:          newStudent.Id,
			Name:        newStudent.Name,
			DateOfBirth: newStudent.DateOfBirth,
		}
		if err := writeJson(w, response); err != nil {
			return createWriteJsonError(err)
		}
		return nil
	}}
}

func getStudentById(env Env) AppHandler {
	type responseBody struct {
		Id          string     `json:"id"`
		Name        string     `json:"name"`
		DateOfBirth *time.Time `json:"dateOfBirth,omitempty"`
	}
	return AppHandler{env, func(w http.ResponseWriter, r *http.Request) *HTTPError {
		id := chi.URLParam(r, "id")

		var student Student
		if err := env.db.Model(&student).
			Where("id = ?", id).
			Select(); err != nil {
			return &HTTPError{http.StatusNotFound, "Can't find student with specified id", err}
		}

		response := responseBody{
			Id:          student.Id,
			Name:        student.Name,
			DateOfBirth: student.DateOfBirth,
		}
		if err := writeJson(w, response); err != nil {
			return createWriteJsonError(err)
		}
		return nil
	}}
}

func addObservationToStudent(env Env) AppHandler {
	var requestBody struct {
		ShortDesc  string `json:"shortDesc"`
		LongDesc   string `json:"longDesc"`
		CategoryId string `json:"categoryId"`
	}
	return AppHandler{env, func(w http.ResponseWriter, r *http.Request) *HTTPError {
		id := chi.URLParam(r, "id")

		if err := parseJson(r.Body, &requestBody); err != nil {
			return createParseJsonError(err)
		}

		observationId := uuid.New()
		observation := Observation{
			Id:          observationId.String(),
			StudentId:   id,
			ShortDesc:   requestBody.ShortDesc,
			LongDesc:    requestBody.LongDesc,
			CategoryId:  requestBody.CategoryId,
			CreatedDate: time.Now(),
		}
		if err := env.db.Insert(&observation); err != nil {
			return &HTTPError{http.StatusInternalServerError, "Failed inserting observation", err}
		}

		w.WriteHeader(http.StatusCreated)
		if err := writeJson(w, observation); err != nil {
			return createWriteJsonError(err)
		}
		return nil
	}}
}

func getAllStudentObservations(env Env) AppHandler {
	return AppHandler{env, func(w http.ResponseWriter, r *http.Request) *HTTPError {
		id := chi.URLParam(r, "id")

		// TODO: Do not return SQL related observation model
		var observations []Observation
		if err := env.db.Model(&observations).
			Where("student_id=?", id).
			Order("created_date").
			Select(); err != nil {
			return &HTTPError{http.StatusInternalServerError, "Fail to query students", err}
		}

		if err := writeJson(w, observations); err != nil {
			return createWriteJsonError(err)
		}
		return nil
	}}
}

func getStudentProgress(env Env) AppHandler {
	type responseBody struct {
		AreaId       string    `json:"areaId"`
		MaterialName string    `json:"materialName"`
		MaterialId   string    `json:"materialId"`
		Stage        int       `json:"stage"`
		UpdatedAt    time.Time `json:"updatedAt"`
	}
	return AppHandler{env, func(w http.ResponseWriter, r *http.Request) *HTTPError {
		studentId := chi.URLParam(r, "id")
		//areaId := r.URL.Query().Get("areaId")

		var progresses []StudentMaterialProgress
		if err := env.db.Model(&progresses).
			Relation("Material").
			Relation("Material.Subject").
			Relation("Material.Subject.Area").
			Where("student_id=?", studentId).
			Select(); err != nil {
			return &HTTPError{http.StatusInternalServerError, "Failed querying material", err}
		}

		// return empty array when there is no data
		response := make([]responseBody, 0)
		for _, progress := range progresses {
			response = append(response, responseBody{
				AreaId:       progress.Material.Subject.Area.Id,
				MaterialName: progress.Material.Name,
				MaterialId:   progress.MaterialId,
				Stage:        progress.Stage,
				UpdatedAt:    progress.UpdatedAt,
			})
		}

		if err := writeJson(w, response); err != nil {
			return createWriteJsonError(err)
		}
		return nil
	}}
}

func updateMaterialProgress(env Env) AppHandler {
	type requestBody struct {
		Stage int `json:"stage"`
	}
	return AppHandler{env, func(w http.ResponseWriter, r *http.Request) *HTTPError {
		studentId := chi.URLParam(r, "id")
		materialId := chi.URLParam(r, "materialId")

		var requestBody requestBody
		if err := parseJson(r.Body, &requestBody); err != nil {
			return createParseJsonError(err)
		}

		progress := StudentMaterialProgress{
			MaterialId: materialId,
			StudentId:  studentId,
			Stage:      requestBody.Stage,
			UpdatedAt:  time.Now(),
		}
		if _, err := env.db.Model(&progress).
			OnConflict("(material_id, student_id) DO UPDATE").
			Insert(); err != nil {
			return &HTTPError{http.StatusInternalServerError, "Failed updating progress", err}
		}
		return nil
	}}
}
