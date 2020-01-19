package main

import (
	"errors"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
	"net/http"
	"os"
	"time"
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
	r.Method("POST", "/", createNewSchool(env))

	r.Route("/{schoolId}", func(r chi.Router) {
		r.Use(createSchoolAuthorizationCheckMiddleware(env))
		r.Method("GET", "/", getSchoolInfo(env))
		r.Method("GET", "/students", getAllStudentsOfSchool(env))
		r.Method("POST", "/students", createStudent(env))
		r.Method("POST", "/invite-code", generateNewInviteCode(env))

		r.Method("POST", "/curriculum", createNewCurriculum(env))
		r.Method("DELETE", "/curriculum", deleteCurriculum(env))
		r.Method("GET", "/curriculum", getCurriculum(env))
		r.Method("GET", "/curriculum/areas", getCurriculumAreas(env))
	})
	return r
}

func createSchoolAuthorizationCheckMiddleware(env Env) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return AppHandler{env, func(w http.ResponseWriter, r *http.Request) *HTTPError {
			schoolId := chi.URLParam(r, "schoolId")

			// Verify use access to the school
			session, ok := getSessionFromCtx(r.Context())
			if !ok {
				return createGetSessionError()
			}
			if err := checkUserIsAuthorized(session.UserId, schoolId, env); err != nil {
				return &HTTPError{http.StatusUnauthorized, "You're not authorized to access this school", err}
			}
			next.ServeHTTP(w, r)
			return nil
		}}
	}
}

// TODO: refactor into middleware
func checkUserIsAuthorized(userId string, schoolId string, env Env) error {
	// check if user have permission
	var user User
	if err := env.db.Model(&user).
		Where("id=?", userId).
		Relation("Schools").
		Select(); err != nil {
		return err
	}
	userHasAccess := false
	for _, school := range user.Schools {
		if school.Id == schoolId {
			userHasAccess = true
			break
		}
	}
	if !userHasAccess {
		return errors.New("unauthorized access to " + schoolId + " by " + userId)
	}
	return nil
}

func getSchoolInfo(env Env) AppHandler {
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

	return AppHandler{env, func(w http.ResponseWriter, r *http.Request) *HTTPError {
		schoolId := chi.URLParam(r, "schoolId")
		session, _ := getSessionFromCtxOld(w, r, env.logger)

		// Get school data
		var school School
		if err := env.db.Model(&school).
			Relation("Users").
			Where("id=?", schoolId).
			Select(); err != nil {
			return &HTTPError{http.StatusInternalServerError, "Failed getting school data", err}
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

		if err := writeJsonResponseOld(w, response, env.logger); err != nil {
			return &HTTPError{http.StatusInternalServerError, "Failed writing message", err}
		}
		return nil
	}}
}

func createStudent(env Env) AppHandler {
	var requestBody struct {
		Name        string     `json:"name"`
		DateOfBirth *time.Time `json:"dateOfBirth"`
	}
	type responseBody struct {
		Id          string     `json:"id"`
		Name        string     `json:"name"`
		DateOfBirth *time.Time `json:"dateOfBirth,omitempty"`
	}
	return AppHandler{env, func(w http.ResponseWriter, r *http.Request) *HTTPError {
		schoolId := chi.URLParam(r, "schoolId")
		if err := parseJson(r.Body, &requestBody); err != nil {
			return createParseJsonError(err)
		}

		id := uuid.New()
		student := Student{
			Id:          id.String(),
			Name:        requestBody.Name,
			SchoolId:    schoolId,
			DateOfBirth: requestBody.DateOfBirth,
		}
		if err := env.db.Insert(&student); err != nil {
			return &HTTPError{http.StatusInternalServerError, "Failed saving new student", err}
		}

		response := responseBody{
			Id:          student.Id,
			Name:        student.Name,
			DateOfBirth: student.DateOfBirth,
		}
		w.WriteHeader(http.StatusCreated)
		if err := writeJson(w, response); err != nil {
			return &HTTPError{http.StatusInternalServerError, "Failed writing result", err}
		}
		return nil
	}}
}

func getAllStudentsOfSchool(env Env) AppHandler {
	type responseBody struct {
		Id          string     `json:"id"`
		Name        string     `json:"name"`
		DateOfBirth *time.Time `json:"dateOfBirth,omitempty"`
	}
	return AppHandler{env, func(w http.ResponseWriter, r *http.Request) *HTTPError {
		schoolId := chi.URLParam(r, "schoolId")

		var students []Student
		err := env.db.Model(&students).
			Where("school_id=?", schoolId).
			Order("name").
			Select()
		if err != nil {
			return &HTTPError{http.StatusInternalServerError, "Failed getting all students", err}
		}

		response := make([]responseBody, 0)
		for _, student := range students {
			response = append(response, responseBody{
				Id:          student.Id,
				Name:        student.Name,
				DateOfBirth: student.DateOfBirth,
			})
		}
		if err = writeJson(w, response); err != nil {
			return createWriteJsonError(err)
		}
		return nil
	}}
}

func createNewSchool(env Env) AppHandler {
	var requestBody struct {
		Name string
	}
	return AppHandler{env, func(w http.ResponseWriter, r *http.Request) *HTTPError {
		session, ok := getSessionFromCtx(r.Context())
		if !ok {
			return createGetSessionError()
		}
		if err := parseJson(r.Body, &requestBody); err != nil {
			return createParseJsonError(err)
		}

		id := uuid.New()
		inviteCode := uuid.New()
		school := School{
			Id:         id.String(),
			Name:       requestBody.Name,
			InviteCode: inviteCode.String(),
		}
		userToSchoolRelation := UserToSchool{
			SchoolId: id.String(),
			UserId:   session.UserId,
		}

		if err := env.db.Insert(&school); err != nil {
			return &HTTPError{http.StatusInternalServerError, "failed saving school data", err}
		}
		if err := env.db.Insert(&userToSchoolRelation); err != nil {
			return &HTTPError{http.StatusInternalServerError, "failed saving school relation", err}
		}
		w.WriteHeader(http.StatusCreated)
		if err := writeJson(w, school); err != nil {
			return createWriteJsonError(err)
		}
		return nil
	}}
}

func generateNewInviteCode(env Env) AppHandler {
	return AppHandler{env, func(w http.ResponseWriter, r *http.Request) *HTTPError {
		schoolId := chi.URLParam(r, "schoolId")

		// Get related school details
		var school School
		if err := env.db.Model(&school).
			Where("id=?", schoolId).
			Select(); err != nil {
			return &HTTPError{http.StatusInternalServerError, "Failed getting school info", err}
		}

		// Update invite code
		school.InviteCode = uuid.New().String()
		if err := env.db.Update(&school); err != nil {
			return &HTTPError{http.StatusInternalServerError, "Failed updating school invite code", err}
		}

		if err := writeJson(w, school); err != nil {
			return createWriteJsonError(err)
		}
		return nil
	}}
}

func createNewCurriculum(env Env) AppHandler {
	return AppHandler{env, func(w http.ResponseWriter, r *http.Request) *HTTPError {
		// Get school id
		schoolId := chi.URLParam(r, "schoolId")

		// Return conflict error if school already has curriculum
		var school School
		if err := env.db.Model(&school).
			Where("id=?", schoolId).
			Select(); err != nil {
			return &HTTPError{http.StatusInternalServerError, "Failed to get school data", err}
		}
		if school.CurriculumId != "" {
			return &HTTPError{http.StatusConflict, "School already have curriculum", errors.New("curriculum conflict")}
		}

		// Save default curriculum using transaction
		if err := env.db.RunInTransaction(insertFullCurriculum(school, createDefaultCurriculum())); err != nil {
			return &HTTPError{http.StatusInternalServerError, "Failed saving newly created curriculum", err}
		}

		// Return result
		w.WriteHeader(http.StatusCreated)
		return nil
	}}
}

func deleteCurriculum(env Env) AppHandler {
	return AppHandler{env, func(w http.ResponseWriter, r *http.Request) *HTTPError {
		// Get school id
		schoolId := chi.URLParam(r, "schoolId")

		// Get school data and check if curriculum exists
		var school School
		err := env.db.Model(&school).
			Relation("Curriculum").
			Where("school.id=?", schoolId).
			Select()
		if err != nil {
			return &HTTPError{http.StatusInternalServerError, "Failed to get student data", err}
		}

		// Don't do anything if school doesn't have curriculum yet
		if school.CurriculumId == "" {
			return &HTTPError{http.StatusNotFound, "School doesn't have curriculum", err}
		}

		// Delete the whole curriculum tree.
		if err = env.db.Delete(&(school.Curriculum)); err != nil {
			return &HTTPError{http.StatusInternalServerError, "Failed to delete curriculum", err}
		}
		return nil
	}}
}

func getCurriculum(env Env) AppHandler {
	type responseBody struct {
		Id   string `json:"id"`
		Name string `json:"name"`
	}
	return AppHandler{env, func(w http.ResponseWriter, r *http.Request) *HTTPError {
		// Get school id
		schoolId := chi.URLParam(r, "schoolId")

		// Get school data and check if curriculum exists
		var school School
		err := env.db.Model(&school).
			Relation("Curriculum").
			Where("school.id=?", schoolId).
			Select()
		if err != nil {
			return &HTTPError{http.StatusInternalServerError, "Failed to get school data", err}
		}

		// Don't do anything if school doesn't have curriculum yet
		if school.CurriculumId == "" {
			return &HTTPError{http.StatusNotFound, "School doesn't have curriculum yet", err}
		}

		// Format queried result into response format.
		response := responseBody{school.CurriculumId, school.Curriculum.Name}
		if err = writeJson(w, response); err != nil {
			return createWriteJsonError(err)
		}
		return nil
	}}
}

func getCurriculumAreas(env Env) AppHandler {
	type simplifiedArea struct {
		Id   string `json:"id"`
		Name string `json:"name"`
	}
	return AppHandler{env, func(w http.ResponseWriter, r *http.Request) *HTTPError {
		// Get school id
		schoolId := chi.URLParam(r, "schoolId")

		// Get school data and check if curriculum exists
		var school School
		if err := env.db.Model(&school).
			Where("id=?", schoolId).
			Select(); err != nil {
			return &HTTPError{http.StatusInternalServerError, "Failed to get school data", err}
		}

		// Don't do anything if school doesn't have curriculum yet
		if school.CurriculumId == "" {
			return &HTTPError{http.StatusNotFound, "School doesn't have any curriculum.", errors.New("can't find curriculum")}
		}

		var areas []Area
		if err := env.db.Model(&areas).
			Where("curriculum_id=?", school.CurriculumId).
			Select(); err != nil {
			return &HTTPError{http.StatusInternalServerError, "Failed to get area data", err}
		}

		// Format queried result into response format.
		var response []simplifiedArea
		for _, area := range areas {
			response = append(response, simplifiedArea{
				Id:   area.Id,
				Name: area.Name,
			})
		}

		if err := writeJson(w, response); err != nil {
			return &HTTPError{http.StatusInternalServerError, "Failed to write json response", err}
		}
		return nil
	}}
}
