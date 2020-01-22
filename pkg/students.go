package main

import (
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"github.com/go-pg/pg/v9"
	"github.com/google/uuid"
	"net/http"
	"time"
)

func createStudentsSubroute(env Env) *chi.Mux {
	r := chi.NewRouter()
	r.Route("/{studentId}", func(r chi.Router) {
		r.Method("GET", "/", getStudentById(env))
		r.Method("DELETE", "/", deleteStudent(env))
		r.Method("PUT", "/", replaceStudent(env))

		r.Method("POST", "/observations", addObservationToStudent(env))
		r.Method("GET", "/observations", getAllStudentObservations(env))

		r.Method("GET", "/materialsProgress", getStudentProgress(env))
		r.Method("PATCH", "/materialsProgress/{materialId}", updateMaterialProgress(env))
	})

	return r
}

func getStudentById(env Env) rest.Handler {
	type responseBody struct {
		Id          string     `json:"id"`
		Name        string     `json:"name"`
		DateOfBirth *time.Time `json:"dateOfBirth,omitempty"`
	}
	return rest.Handler{env.logger, func(w http.ResponseWriter, r *http.Request) *rest.Error {
		id := chi.URLParam(r, "studentId")

		student, err := env.studentStore.Get(id)
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
	}}
}

func deleteStudent(env Env) rest.Handler {
	return rest.Handler{env.logger, func(w http.ResponseWriter, r *http.Request) *rest.Error {
		studentId := chi.URLParam(r, "studentId") // from a route like /users/{userID}
		if err := env.studentStore.Delete(studentId); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed deleting student", err}
		}
		return nil
	}}
}

func replaceStudent(env Env) rest.Handler {
	type requestBody struct {
		Name        string     `json:"name"`
		DateOfBirth *time.Time `json:"dateOfBirth"`
	}
	type responseBody struct {
		Id          string     `json:"id"`
		Name        string     `json:"name"`
		DateOfBirth *time.Time `json:"dateOfBirth,omitempty"`
	}
	return rest.Handler{env.logger, func(w http.ResponseWriter, r *http.Request) *rest.Error {
		targetId := chi.URLParam(r, "studentId") // from a route like /users/{userID}

		var requestBody requestBody
		if err := rest.ParseJson(r.Body, &requestBody); err != nil {
			return rest.NewParseJsonError(err)
		}

		oldStudent, err := env.studentStore.Get(targetId)
		if err != nil {
			return &rest.Error{http.StatusNotFound, "Can't find old student data", err}
		}

		newStudent := oldStudent
		newStudent.Name = requestBody.Name
		newStudent.DateOfBirth = requestBody.DateOfBirth
		if err := env.studentStore.Update(newStudent); err != nil {
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
	}}
}

func addObservationToStudent(env Env) rest.Handler {
	var requestBody struct {
		ShortDesc  string `json:"shortDesc"`
		LongDesc   string `json:"longDesc"`
		CategoryId string `json:"categoryId"`
	}
	return rest.Handler{env.logger, func(w http.ResponseWriter, r *http.Request) *rest.Error {
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
		if err := env.db.Insert(&observation); err != pg.ErrNoRows {
			return &rest.Error{http.StatusInternalServerError, "Failed inserting observation", err}
		}

		w.WriteHeader(http.StatusCreated)
		if err := rest.WriteJson(w, observation); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	}}
}

func getAllStudentObservations(env Env) rest.Handler {
	return rest.Handler{env.logger, func(w http.ResponseWriter, r *http.Request) *rest.Error {
		id := chi.URLParam(r, "studentId")

		// TODO: Do not return SQL related observation model
		var observations []postgres.Observation
		if err := env.db.Model(&observations).
			Where("student_id=?", id).
			Order("created_date").
			Select(); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Fail to query students", err}
		}

		if err := rest.WriteJson(w, observations); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	}}
}

func getStudentProgress(env Env) rest.Handler {
	type responseBody struct {
		AreaId       string    `json:"areaId"`
		MaterialName string    `json:"materialName"`
		MaterialId   string    `json:"materialId"`
		Stage        int       `json:"stage"`
		UpdatedAt    time.Time `json:"updatedAt"`
	}
	return rest.Handler{env.logger, func(w http.ResponseWriter, r *http.Request) *rest.Error {
		studentId := chi.URLParam(r, "studentId")
		//areaId := r.URL.Query().Get("areaId")

		var progresses []postgres.StudentMaterialProgress
		if err := env.db.Model(&progresses).
			Relation("Material").
			Relation("Material.Subject").
			Relation("Material.Subject.Area").
			Where("student_id=?", studentId).
			Select(); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed querying material", err}
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

		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	}}
}

func updateMaterialProgress(env Env) rest.Handler {
	type requestBody struct {
		Stage int `json:"stage"`
	}
	return rest.Handler{env.logger, func(w http.ResponseWriter, r *http.Request) *rest.Error {
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
		if _, err := env.db.Model(&progress).
			OnConflict("(material_id, student_id) DO UPDATE").
			Insert(); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed updating progress", err}
		}
		return nil
	}}
}

type StudentStore interface {
	Get(string) (*postgres.Student, error)
	Update(*postgres.Student) error
	Delete(string) error
}

type PgStudentStore struct {
	db *pg.DB
}

func (s PgStudentStore) Get(studentId string) (*postgres.Student, error) {
	var student postgres.Student
	if err := s.db.Model(&student).
		Where("id=?", studentId).
		Select(); err != nil {
		return nil, err
	}
	return &student, nil
}

func (s PgStudentStore) Update(student *postgres.Student) error {
	return s.db.Update(student)
}

func (s PgStudentStore) Delete(studentId string) error {
	student := postgres.Student{Id: studentId}
	return s.db.Delete(&student)
}
