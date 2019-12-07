package main

import (
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
		if ok := parseJsonRequestBody(w, r, &requestBody, env.logger); !ok {
			return
		}

		id, err := uuid.NewRandom()
		if err != nil {
			returnInternalServerError("Failed to generate new uuid", w, err, env.logger)
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

		w.WriteHeader(http.StatusCreated)
		err = writeJsonResponse(w, student, env.logger)
	}
}

func getAllStudentsOfSchool(env Env) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		schoolId := chi.URLParam(r, "schoolId")

		var students []Student
		err := env.db.Model(&students).
			Where("school_id=?", schoolId).
			Order("name").
			Select()
		if err != nil {
			env.logger.Error("Error getting all students", zap.Error(err))
		}

		err = writeJsonResponse(w, students, env.logger)
	}
}

func createNewSchool(env Env) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		session, ok := getSessionFromCtx(w, r, env.logger)
		if !ok {
			return
		}

		var user User
		err := env.db.Model(&user).Where("id=?", session.UserId).Select()
		if err != nil {
			env.logger.Error("Failed getting user data", zap.Error(err))
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			return
		}

		var requestBody struct {
			Name string
		}
		if ok := parseJsonRequestBody(w, r, &requestBody, env.logger); !ok {
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

		w.WriteHeader(http.StatusCreated)
		err = writeJsonResponse(w, school, env.logger)
	}
}
