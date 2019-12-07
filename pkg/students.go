package main

import (
	"github.com/go-chi/chi"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"net/http"
	"time"
)

type Student struct {
	Id       string `json:"id" pg:",type:uuid"`
	Name     string `json:"name"`
	SchoolId string
}

func createStudentsSubroute(env Env) *chi.Mux {
	r := chi.NewRouter()
	r.Get("/{id}", getStudentById(env))
	r.Delete("/{id}", deleteStudent(env))
	r.Put("/{id}", replaceStudent(env))

	r.Post("/{id}/observations", addObservationToStudent(env))
	r.Get("/{id}/observations", getAllStudentObservations(env))
	return r
}

func deleteStudent(env Env) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		deletedId := chi.URLParam(r, "id") // from a route like /users/{userID}
		student := Student{Id: deletedId}
		err := env.db.Delete(&student)
		if err != nil {
			env.logger.Error("Failed deleting student", zap.Error(err))
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	}
}

func replaceStudent(env Env) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		targetId := chi.URLParam(r, "id") // from a route like /users/{userID}

		var requestBody struct {
			Name string `json:"name"`
		}
		if ok := parseJsonRequestBody(w, r, &requestBody, env.logger); !ok {
			return
		}

		student := Student{
			Id:   targetId,
			Name: requestBody.Name,
		}
		err := env.db.Update(&student)
		if err != nil {
			env.logger.Error("Failed creating new student", zap.Error(err))
		}

		err = writeJsonResponse(w, student, env.logger)
	}
}

func getStudentById(env Env) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := chi.URLParam(r, "id") // from a route like /users/{userID}
		var student Student
		err := env.db.Model(&student).Where("id = ?", id).Select()
		if err != nil {
			env.logger.Error("Failed deleting student", zap.Error(err))
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		err = writeJsonResponse(w, student, env.logger)
	}
}

func addObservationToStudent(env Env) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var requestBody struct {
			ShortDesc string `json:"shortDesc"`
			LongDesc  string `json:"longDesc"`
		}
		if ok := parseJsonRequestBody(w, r, &requestBody, env.logger); !ok {
			return
		}

		id := chi.URLParam(r, "id")
		observationId, err := uuid.NewRandom()
		if err != nil {
			env.logger.Error("Error creating UUID", zap.Error(err))
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		observation := Observation{
			Id:          observationId.String(),
			StudentId:   id,
			ShortDesc:   requestBody.ShortDesc,
			LongDesc:    requestBody.LongDesc,
			CreatedDate: time.Now(),
		}
		err = env.db.Insert(&observation)
		if err != nil {
			env.logger.Error("Error inserting observation", zap.Error(err))
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		err = writeJsonResponse(w, observation, env.logger)
	}
}

func getAllStudentObservations(env Env) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		id := chi.URLParam(r, "id")

		var observations []Observation
		err := env.db.Model(&observations).Where("student_id=?", id).Order("created_date").Select()
		if err != nil {
			env.logger.Error("Fail querying observations for students", zap.Error(err))
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			return
		}

		err = writeJsonResponse(w, observations, env.logger)
	}
}
