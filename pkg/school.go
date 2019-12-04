package main

import (
	"encoding/json"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"net/http"
)

type School struct {
	Id   string `json:"id" pg:",type:uuid"`
	Name string `json:"name"`
}

type UserToSchool struct {
	SchoolId string `pg:",type:uuid"`
	UserId   string `pg:",type:uuid"`
}

func createSchoolsSubroute(env Env) *chi.Mux {
	r := chi.NewRouter()
	r.Post("/", createNewSchool(env))
	r.Get("/{schoolId}/students", getAllStudentsOfSchool(env))
	r.Post("/{schoolId}/students", createNewStudentForSchool(env))
	return r
}

func createNewStudentForSchool(env Env) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		schoolId := chi.URLParam(r, "schoolId")
		var requestBody struct {
			Name string `json:"name"`
		}
		err := json.NewDecoder(r.Body).Decode(&requestBody)
		if err != nil {
			env.logger.Error("Failed to decode request body", zap.Error(err))
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		id, err := uuid.NewRandom()
		if err != nil {
			env.logger.Error("Failed to generate new uuid", zap.Error(err))
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		student := Student{
			Id:       id.String(),
			Name:     requestBody.Name,
			SchoolId: schoolId,
		}
		err = env.db.Insert(&student)
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
		w.WriteHeader(http.StatusCreated)
		_, err = w.Write(res)
		if err != nil {
			env.logger.Error("Fail writing response for getting all student", zap.Error(err))
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			return
		}
	}
}

func getAllStudentsOfSchool(env Env) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		schoolId := chi.URLParam(r, "schoolId")
		var students []Student
		err := env.db.Model(&students).Where("school_id=?", schoolId).Select()
		if err != nil {
			env.logger.Error("Error getting all students", zap.Error(err))
		}

		res, err := json.Marshal(students)
		if err != nil {
			env.logger.Error("Error marshaling students", zap.Error(err))
		}

		w.Header().Add("Content-Type", "application/json")
		_, err = w.Write(res)
		if err != nil {
			env.logger.Error("Error writing response", zap.Error(err))
		}
	}
}

func createNewSchool(env Env) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		tokenCookie, err := r.Cookie("session")
		if err != nil {
			env.logger.Error("Error getting session cookie", zap.Error(err))
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		var session Session
		err = env.db.Model(&session).Where("token=?", tokenCookie.Value).Select()
		if err != nil {
			env.logger.Error("Failed querying session", zap.Error(err))
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			return
		}

		var user User
		err = env.db.Model(&user).Where("id=?", session.UserId).Select()
		if err != nil {
			env.logger.Error("Failed getting user data", zap.Error(err))
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			return
		}

		var requestBody struct {
			Name string
		}
		err = json.NewDecoder(r.Body).Decode(&requestBody)
		if err != nil {
			env.logger.Error("Failed decoding new school request body", zap.Error(err))
			http.Error(w, "Invalid format", http.StatusBadRequest)
			return
		}

		id, err := uuid.NewRandom()
		if err != nil {
			env.logger.Error("Error creating new id", zap.Error(err))
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			return
		}
		school := School{
			Id:   id.String(),
			Name: requestBody.Name,
		}
		userToSchoolRelation := UserToSchool{
			SchoolId: id.String(),
			UserId:   user.Id,
		}

		err = env.db.Insert(&school)
		if err != nil {
			env.logger.Error("Failed saving school data", zap.Error(err))
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			return
		}
		err = env.db.Insert(&userToSchoolRelation)
		if err != nil {
			env.logger.Error("Failed saving school data", zap.Error(err))
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			return
		}
	}
}
