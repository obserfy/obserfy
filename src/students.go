package main

import (
	"encoding/json"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"net/http"
)

type Student struct {
	Id   string `json:"id" pg:",type:uuid"`
	Name string `json:"name"`
}

func getStudentsSubroute(env Env) *chi.Mux {
	r := chi.NewRouter()
	r.Get("/", getAllStudents(env))
	r.Get("/{id}", getStudentById(env))
	r.Post("/", createNewStudent(env))
	r.Delete("/{id}", deleteStudent(env))
	r.Put("/{id}", replaceStudent(env))
	return r
}

func getAllStudents(env Env) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var students []Student
		err := env.db.Model(&students).Select()
		if err != nil {
			env.logger.Error("Error getting all students", zap.Error(err))
		}

		res, err := json.Marshal(students)
		if err != nil {
			env.logger.Error("Error marshaling students", zap.Error(err))
		}

		_, err = w.Write(res)
		if err != nil {
			env.logger.Error("Error writing response", zap.Error(err))
		}
	}
}

func createNewStudent(env Env) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var requestBody struct {
			Name string `json:"name"`
		}
		err := json.NewDecoder(r.Body).Decode(&requestBody)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		id, err := uuid.NewRandom()
		if err != nil {
			env.logger.Error("Failed to generate new uuid", zap.Error(err))
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		student := Student{
			Id:   id.String(),
			Name: requestBody.Name,
		}
		err = env.db.Insert(&student)
		if err != nil {
			env.logger.Error("Failed creating new student", zap.Error(err))
		}
	}
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
		idToReplace := chi.URLParam(r, "id") // from a route like /users/{userID}
		var requestBody struct {
			Name string `json:"name"`
		}
		err := json.NewDecoder(r.Body).Decode(requestBody)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		student := Student{
			Id:   idToReplace,
			Name: requestBody.Name,
		}
		err = env.db.Update(&student)
		if err != nil {
			env.logger.Error("Failed creating new student", zap.Error(err))
		}
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
		}

		res, err := json.Marshal(student)
		if err != nil {
			env.logger.Error("Error marshaling student", zap.Error(err))
		}

		_, err = w.Write(res)
		if err != nil {
			env.logger.Error("Error writing response", zap.Error(err))
		}
	}
}
