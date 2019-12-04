package main

import (
	"encoding/json"
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
		err := json.NewDecoder(r.Body).Decode(&requestBody)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		student := Student{
			Id:   targetId,
			Name: requestBody.Name,
		}
		err = env.db.Update(&student)
		if err != nil {
			env.logger.Error("Failed creating new student", zap.Error(err))
		}

		res, err := json.Marshal(student)
		if err != nil {
			env.logger.Error("Fail marshalling student", zap.Error(err))
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			return
		}
		w.Header().Add("Content-Type", "application/json")
		_, err = w.Write(res)
		if err != nil {
			env.logger.Error("Fail writing response for getting all student", zap.Error(err))
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			return
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
			return
		}

		res, err := json.Marshal(student)
		if err != nil {
			env.logger.Error("Error marshaling student", zap.Error(err))
		}

		w.Header().Add("Content-Type", "application/json")
		_, err = w.Write(res)
		if err != nil {
			env.logger.Error("Error writing response", zap.Error(err))
		}
	}
}

func addObservationToStudent(env Env) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var requestBody struct {
			ShortDesc string `json:"shortDesc"`
			LongDesc  string `json:"longDesc"`
		}
		err := json.NewDecoder(r.Body).Decode(&requestBody)
		if err != nil {
			env.logger.Error("Error getting request body", zap.Error(err))
			http.Error(w, "Invalid request body", http.StatusBadRequest)
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

		res, err := json.Marshal(observation)
		if err != nil {
			env.logger.Error("Error marshalling created observation", zap.Error(err))
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			return
		}
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		_, err = w.Write(res)
		if err != nil {
			env.logger.Error("Error returning created observation to client", zap.Error(err))
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
		}
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

		res, err := json.Marshal(observations)
		w.Header().Add("Content-Type", "application/json")
		_, err = w.Write(res)
		if err != nil {
			env.logger.Error("Fail writing response for getting all student", zap.Error(err))
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			return
		}
	}
}
