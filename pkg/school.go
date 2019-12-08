package main

import (
	"github.com/go-chi/chi"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"net/http"
)

type School struct {
	Id         string `json:"id" pg:",type:uuid"`
	Name       string `json:"name"`
	InviteCode string `json:"inviteCode"`
	Users      []User `pg:"many2many:user_to_schools,joinFK:user_id"`
}

type UserToSchool struct {
	SchoolId string `pg:",type:uuid"`
	UserId   string `pg:",type:uuid"`
}

func createSchoolsSubroute(env Env) *chi.Mux {
	r := chi.NewRouter()
	r.Post("/", createNewSchool(env))
	r.Get("/{schoolId}", getSchoolInfo(env))
	r.Get("/{schoolId}/students", getAllStudentsOfSchool(env))
	r.Post("/{schoolId}/students", createNewStudentForSchool(env))
	r.Post("/{schoolId}/invite-code", generateNewInviteCode(env))
	return r
}

func getSchoolInfo(env Env) http.HandlerFunc {
	type responseUserField struct {
		Name  string `json:"name"`
		Email string `json:"email"`
		IsYou bool   `json:"isYou"`
	}

	type response struct {
		Name       string              `json:"name"`
		InviteLink string              `json:"inviteLink"`
		Users      []responseUserField `json:"users"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		schoolId := chi.URLParam(r, "schoolId")
		session, ok := getSessionFromCtx(w, r, env.logger)
		if !ok {
			return
		}
		if ok := checkUserIsAuthorized(w, session.UserId, schoolId, env); !ok {
			return
		}

		var school School
		err := env.db.Model(&school).
			Relation("Users").
			Where("id=?", schoolId).
			Select()
		if err != nil {
			writeInternalServerError("Failed getting school data", w, err, env.logger)
			return
		}
		users := make([]responseUserField, len(school.Users))
		for i, user := range school.Users {
			users[i].Email = user.Email
			users[i].Name = user.Name
			users[i].IsYou = user.Id == session.UserId
		}
		response := response{
			Name:       school.Name,
			InviteLink: "/login?inviteCode=" + school.InviteCode,
			Users:      users,
		}
		_ = writeJsonResponse(w, response, env.logger)
	}
}

func createNewStudentForSchool(env Env) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		schoolId := chi.URLParam(r, "schoolId")
		session, ok := getSessionFromCtx(w, r, env.logger)
		if !ok {
			return
		}

		if ok := checkUserIsAuthorized(w, session.UserId, schoolId, env); !ok {
			return
		}

		var requestBody struct {
			Name string `json:"name"`
		}
		if ok := parseJsonRequestBody(w, r, &requestBody, env.logger); !ok {
			return
		}

		id, err := uuid.NewRandom()
		if err != nil {
			writeInternalServerError("Failed to generate new uuid", w, err, env.logger)
			return
		}
		student := Student{
			Id:       id.String(),
			Name:     requestBody.Name,
			SchoolId: schoolId,
		}
		err = env.db.Insert(&student)
		if err != nil {
			writeInternalServerError("Failed saving new student", w, err, env.logger)
			return
		}

		w.WriteHeader(http.StatusCreated)
		err = writeJsonResponse(w, student, env.logger)
	}
}

func getAllStudentsOfSchool(env Env) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		schoolId := chi.URLParam(r, "schoolId")
		session, ok := getSessionFromCtx(w, r, env.logger)
		if !ok {
			return
		}

		if ok := checkUserIsAuthorized(w, session.UserId, schoolId, env); !ok {
			return
		}

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
		inviteCode, err := uuid.NewRandom()
		if err != nil {
			env.logger.Error("Error creating invite code", zap.Error(err))
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			return
		}
		school := School{
			Id:         id.String(),
			Name:       requestBody.Name,
			InviteCode: inviteCode.String(),
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

func generateNewInviteCode(env Env) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		schoolId := chi.URLParam(r, "schoolId")
		session, ok := getSessionFromCtx(w, r, env.logger)
		if !ok {
			return
		}

		if ok := checkUserIsAuthorized(w, session.UserId, schoolId, env); !ok {
			return
		}

		// update the generated invite code
		newInviteCode, err := uuid.NewRandom()
		if err != nil {
			env.logger.Error("Error creating invite code", zap.Error(err))
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			return
		}
		var school School
		err = env.db.Model(&school).Where("id=?", schoolId).Select()
		if err != nil {
			writeInternalServerError("Failed fetching school info", w, err, env.logger)
			return
		}
		school.InviteCode = newInviteCode.String()
		err = env.db.Update(&school)
		if err != nil {
			writeInternalServerError("Failed updating school invite code", w, err, env.logger)
			return
		}

		_ = writeJsonResponse(w, school, env.logger)
	}
}

func checkUserIsAuthorized(w http.ResponseWriter, userId string, schoolId string, env Env) bool {
	// check if user have permission
	var user User
	err := env.db.Model(&user).
		Where("id=?", userId).
		Relation("Schools").
		Select()
	if err != nil {
		writeInternalServerError("Failed getting user data", w, err, env.logger)
		return false
	}
	userHasAccess := false
	for _, school := range user.Schools {
		if school.Id == schoolId {
			userHasAccess = true
			break
		}
	}
	if !userHasAccess {
		env.logger.Warn("Unauthorized user tries to change invite code of a school",
			zap.String("userId", user.Id),
			zap.String("schoolId", schoolId),
		)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return false
	}
	return true
}
