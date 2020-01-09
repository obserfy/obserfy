package main

import (
	"github.com/go-chi/chi"
	"github.com/go-pg/pg/v9"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"net/http"
	"os"
)

type School struct {
	Id           string `json:"id" pg:",type:uuid"`
	Name         string `json:"name"`
	InviteCode   string `json:"inviteCode"`
	Users        []User `pg:"many2many:user_to_schools,joinFK:user_id"`
	CurriculumId string `pg:",type:uuid,on_delete:SET NULL"`
	Curriculum   Curriculum
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

	r.Get("/{schoolId}/curriculum", getCurriculum(env))
	r.Post("/{schoolId}/curriculum", createNewCurriculum(env))
	r.Delete("/{schoolId}/curriculum", deleteCurriculum(env))
	return r
}

func getSchoolInfo(env Env) http.HandlerFunc {
	type responseUserField struct {
		Id            string `json:"id"`
		Name          string `json:"name"`
		Email         string `json:"email"`
		IsCurrentUser bool   `json:"isCurrentUser"`
	}

	type response struct {
		Name       string              `json:"name"`
		InviteLink string              `json:"inviteLink"`
		InviteCode string              `json:"inviteCode"`
		Users      []responseUserField `json:"users"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		schoolId := chi.URLParam(r, "schoolId")
		_, err := uuid.Parse(schoolId)
		if err != nil {
			env.logger.Warn("Invalid School ID received", zap.Error(err))
			http.Error(w, "Invalid ID received", http.StatusBadRequest)
			return
		}

		session, ok := getSessionFromCtx(w, r, env.logger)
		if !ok {
			return
		}
		if ok := checkUserIsAuthorized(w, session.UserId, schoolId, env); !ok {
			return
		}

		var school School
		err = env.db.Model(&school).
			Relation("Users").
			Where("id=?", schoolId).
			Select()
		if err != nil {
			writeInternalServerError("Failed getting school data", w, err, env.logger)
			return
		}
		users := make([]responseUserField, len(school.Users))
		for i, user := range school.Users {
			users[i].Id = user.Id
			users[i].Email = user.Email
			users[i].Name = user.Name
			users[i].IsCurrentUser = user.Id == session.UserId
		}
		response := response{
			Name:       school.Name,
			InviteLink: os.Getenv("SITE_URL") + "/register?inviteCode=" + school.InviteCode,
			InviteCode: school.InviteCode,
			Users:      users,
		}
		_ = writeJsonResponse(w, response, env.logger)
	}
}

func createNewStudentForSchool(env Env) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		schoolId := chi.URLParam(r, "schoolId")
		_, err := uuid.Parse(schoolId)
		if err != nil {
			env.logger.Warn("Invalid School ID received", zap.Error(err))
			http.Error(w, "Invalid ID received", http.StatusBadRequest)
			return
		}

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
		_, err := uuid.Parse(schoolId)
		if err != nil {
			env.logger.Warn("Invalid School ID received", zap.Error(err))
			http.Error(w, "Invalid ID received", http.StatusBadRequest)
			return
		}

		session, ok := getSessionFromCtx(w, r, env.logger)
		if !ok {
			return
		}

		if ok := checkUserIsAuthorized(w, session.UserId, schoolId, env); !ok {
			return
		}

		var students []Student
		err = env.db.Model(&students).
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
		_, err := uuid.Parse(schoolId)
		if err != nil {
			env.logger.Warn("Invalid School ID received", zap.Error(err))
			http.Error(w, "Invalid ID received", http.StatusBadRequest)
			return
		}

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

// TODO: refactor into middleware
func checkUserIsAuthorized(w http.ResponseWriter, userId string, schoolId string, env Env) bool {
	// check if user have permission
	var user User
	err := env.db.Model(&user).
		Where("id=?", userId).
		Relation("Schools").
		Select()
	// if we found no associated school, user is definitely unauthorized
	if err == pg.ErrNoRows {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return false
	}
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

func createNewCurriculum(env Env) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get school id
		schoolId := chi.URLParam(r, "schoolId")

		// check session is valid, and user has authorization to access the school.
		session, ok := getSessionFromCtx(w, r, env.logger)
		if !ok {
			return
		}
		if ok := checkUserIsAuthorized(w, session.UserId, schoolId, env); !ok {
			return
		}

		// Return conflict error if school already has curriculum
		var school School
		if err := env.db.Model(&school).Where("id=?", schoolId).Select(); err != nil {
			writeInternalServerError("Failed to get school data.", w, err, env.logger)
			return
		}
		if school.CurriculumId != "" {
			env.logger.Warn("School already have curriculum, but tries to create new one", zap.String("schoolId", schoolId))
			http.Error(w, "School already has curriculum", http.StatusConflict)
			return
		}

		// Save default curriculum using transaction
		if err := env.db.RunInTransaction(insertFullCurriculum(school, createDefaultCurriculum())); err != nil {
			writeInternalServerError("Failed saving curriculum", w, err, env.logger)
			return
		}

		// Return result
		w.WriteHeader(http.StatusCreated)
	}
}

func deleteCurriculum(env Env) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get school id
		schoolId := chi.URLParam(r, "schoolId")

		// check session is valid, and user has authorization to access the school.
		session, ok := getSessionFromCtx(w, r, env.logger)
		if !ok {
			return
		}
		if ok := checkUserIsAuthorized(w, session.UserId, schoolId, env); !ok {
			return
		}

		// Get school data and check if curriculum exists
		var school School
		err := env.db.Model(&school).
			Relation("Curriculum").
			Where("school.id=?", schoolId).
			Select()
		if err != nil {
			writeInternalServerError("Failed to get school data.", w, err, env.logger)
			return
		}

		// Don't do anything if school doesn't have curriculum yet
		if school.CurriculumId == "" {
			env.logger.Warn("School doesn't have a curriculum yet", zap.String("schoolId", schoolId))
			http.Error(w, "School doesn't have a curriculum yet", http.StatusNotFound)
			return
		}

		// Delete the whole curriculum tree.
		if err = env.db.Delete(&(school.Curriculum)); err != nil {
			writeInternalServerError("Failed deleting curriculum", w, err, env.logger)
			return
		}
	}
}

func getCurriculum(env Env) http.HandlerFunc {
	type material struct {
		Name  string `json:"name"`
		Order int    `json:"order"`
	}
	type subject struct {
		Name      string     `json:"name"`
		Materials []material `json:"materials"`
		Order     int        `json:"order"`
	}
	type area struct {
		Name     string    `json:"name"`
		Subjects []subject `json:"subjects"`
	}
	type curriculum struct {
		Name  string `json:"name"`
		Areas []area `json:"areas"`
	}
	return func(w http.ResponseWriter, r *http.Request) {
		// Get school id
		schoolId := chi.URLParam(r, "schoolId")

		// check session is valid, and user has authorization to access the school.
		session, ok := getSessionFromCtx(w, r, env.logger)
		if !ok {
			return
		}
		if ok := checkUserIsAuthorized(w, session.UserId, schoolId, env); !ok {
			return
		}

		// Get school data and check if curriculum exists
		var school School
		err := env.db.Model(&school).
			Relation("Curriculum").
			Relation("Curriculum.Areas").
			Relation("Curriculum.Areas.Subjects").
			Relation("Curriculum.Areas.Subjects.Materials").
			Where("school.id=?", schoolId).
			Select()
		if err != nil {
			writeInternalServerError("Failed to get school data.", w, err, env.logger)
			return
		}

		// Don't do anything if school doesn't have curriculum yet
		if school.CurriculumId == "" {
			env.logger.Warn("School doesn't have a curriculum yet", zap.String("schoolId", schoolId))
			http.Error(w, "School doesn't have a curriculum yet", http.StatusNotFound)
			return
		}

		// Format queried result into response format.
		response := curriculum{Name: school.Curriculum.Name}
		for _, dbArea := range school.Curriculum.Areas {
			simplifiedArea := area{Name: dbArea.Name, Subjects: []subject{}}
			for _, dbSubject := range dbArea.Subjects {
				simplifiedSubject := subject{
					Name:      dbSubject.Name,
					Order:     dbSubject.Order,
					Materials: []material{},
				}
				for _, dbMaterial := range dbSubject.Materials {
					simplifiedMaterial := material{
						Name:  dbMaterial.Name,
						Order: dbMaterial.Order,
					}
					simplifiedSubject.Materials = append(simplifiedSubject.Materials, simplifiedMaterial)
				}
				simplifiedArea.Subjects = append(simplifiedArea.Subjects, simplifiedSubject)
			}
			response.Areas = append(response.Areas, simplifiedArea)
		}

		err = writeJsonResponse(w, response, env.logger)
		if err != nil {
			writeInternalServerError("Fail to get json response", w, err, env.logger)
			return
		}
	}
}
