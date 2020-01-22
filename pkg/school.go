package main

import (
	"errors"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
	"net/http"
	"os"
	"time"
)

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
		return rest.Handler{env.logger, func(w http.ResponseWriter, r *http.Request) *rest.Error {
			schoolId := chi.URLParam(r, "schoolId")

			// Verify use access to the school
			session, ok := getSessionFromCtx(r.Context())
			if !ok {
				return createGetSessionError()
			}
			if err := checkUserIsAuthorized(session.UserId, schoolId, env); err != nil {
				return &rest.Error{http.StatusUnauthorized, "You're not authorized to access this school", err}
			}
			next.ServeHTTP(w, r)
			return nil
		}}
	}
}

// TODO: refactor into middleware
func checkUserIsAuthorized(userId string, schoolId string, env Env) error {
	// check if user have permission
	var user postgres.User
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

func getSchoolInfo(env Env) rest.Handler {
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

	return rest.Handler{env.logger, func(w http.ResponseWriter, r *http.Request) *rest.Error {
		schoolId := chi.URLParam(r, "schoolId")
		session, ok := getSessionFromCtx(r.Context())
		if !ok {
			return createGetSessionError()
		}

		// Get school data
		var school postgres.School
		if err := env.db.Model(&school).
			Relation("Users").
			Where("id=?", schoolId).
			Select(); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed getting school data", err}
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
			InviteLink: "https://" + os.Getenv("SITE_URL") + "/register?inviteCode=" + school.InviteCode,
			InviteCode: school.InviteCode,
			Users:      users,
		}

		if err := rest.WriteJson(w, response); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed writing message", err}
		}
		return nil
	}}
}

func createStudent(env Env) rest.Handler {
	var requestBody struct {
		Name        string     `json:"name"`
		DateOfBirth *time.Time `json:"dateOfBirth,omitempty"`
	}
	type responseBody struct {
		Id          string     `json:"id"`
		Name        string     `json:"name"`
		DateOfBirth *time.Time `json:"dateOfBirth,omitempty"`
	}
	return rest.Handler{env.logger, func(w http.ResponseWriter, r *http.Request) *rest.Error {
		schoolId := chi.URLParam(r, "schoolId")
		if err := rest.ParseJson(r.Body, &requestBody); err != nil {
			return rest.NewParseJsonError(err)
		}

		id := uuid.New()
		student := postgres.Student{
			Id:          id.String(),
			Name:        requestBody.Name,
			SchoolId:    schoolId,
			DateOfBirth: requestBody.DateOfBirth,
		}
		if err := env.db.Insert(&student); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed saving new student", err}
		}

		response := responseBody{
			Id:          student.Id,
			Name:        student.Name,
			DateOfBirth: student.DateOfBirth,
		}
		w.WriteHeader(http.StatusCreated)
		if err := rest.WriteJson(w, response); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed writing result", err}
		}
		return nil
	}}
}

func getAllStudentsOfSchool(env Env) rest.Handler {
	type responseBody struct {
		Id          string     `json:"id"`
		Name        string     `json:"name"`
		DateOfBirth *time.Time `json:"dateOfBirth,omitempty"`
	}
	return rest.Handler{env.logger, func(w http.ResponseWriter, r *http.Request) *rest.Error {
		schoolId := chi.URLParam(r, "schoolId")

		var students []postgres.Student
		err := env.db.Model(&students).
			Where("school_id=?", schoolId).
			Order("name").
			Select()
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed getting all students", err}
		}

		response := make([]responseBody, 0)
		for _, student := range students {
			response = append(response, responseBody{
				Id:          student.Id,
				Name:        student.Name,
				DateOfBirth: student.DateOfBirth,
			})
		}
		if err = rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	}}
}

func createNewSchool(env Env) rest.Handler {
	var requestBody struct {
		Name string
	}
	return rest.Handler{env.logger, func(w http.ResponseWriter, r *http.Request) *rest.Error {
		session, ok := getSessionFromCtx(r.Context())
		if !ok {
			return createGetSessionError()
		}
		if err := rest.ParseJson(r.Body, &requestBody); err != nil {
			return rest.NewParseJsonError(err)
		}

		id := uuid.New()
		inviteCode := uuid.New()
		school := postgres.School{
			Id:         id.String(),
			Name:       requestBody.Name,
			InviteCode: inviteCode.String(),
		}
		userToSchoolRelation := postgres.UserToSchool{
			SchoolId: id.String(),
			UserId:   session.UserId,
		}

		if err := env.db.Insert(&school); err != nil {
			return &rest.Error{http.StatusInternalServerError, "failed saving school data", err}
		}
		if err := env.db.Insert(&userToSchoolRelation); err != nil {
			return &rest.Error{http.StatusInternalServerError, "failed saving school relation", err}
		}
		w.WriteHeader(http.StatusCreated)
		if err := rest.WriteJson(w, school); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	}}
}

func generateNewInviteCode(env Env) rest.Handler {
	return rest.Handler{env.logger, func(w http.ResponseWriter, r *http.Request) *rest.Error {
		schoolId := chi.URLParam(r, "schoolId")

		// Get related school details
		var school postgres.School
		if err := env.db.Model(&school).
			Where("id=?", schoolId).
			Select(); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed getting school info", err}
		}

		// Update invite code
		school.InviteCode = uuid.New().String()
		if err := env.db.Update(&school); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed updating school invite code", err}
		}

		if err := rest.WriteJson(w, school); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	}}
}

func createNewCurriculum(env Env) rest.Handler {
	return rest.Handler{env.logger, func(w http.ResponseWriter, r *http.Request) *rest.Error {
		// Get school id
		schoolId := chi.URLParam(r, "schoolId")

		// Return conflict error if school already has curriculum
		var school postgres.School
		if err := env.db.Model(&school).
			Where("id=?", schoolId).
			Select(); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed to get school data", err}
		}
		if school.CurriculumId != "" {
			return &rest.Error{http.StatusConflict, "School already have curriculum", errors.New("curriculum conflict")}
		}

		// Save default curriculum using transaction
		if err := env.db.RunInTransaction(insertFullCurriculum(school, createDefaultCurriculum())); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed saving newly created curriculum", err}
		}

		// Return result
		w.WriteHeader(http.StatusCreated)
		return nil
	}}
}

func deleteCurriculum(env Env) rest.Handler {
	return rest.Handler{env.logger, func(w http.ResponseWriter, r *http.Request) *rest.Error {
		// Get school id
		schoolId := chi.URLParam(r, "schoolId")

		// Get school data and check if curriculum exists
		var school postgres.School
		err := env.db.Model(&school).
			Relation("Curriculum").
			Where("school.id=?", schoolId).
			Select()
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed to get student data", err}
		}

		// Don't do anything if school doesn't have curriculum yet
		if school.CurriculumId == "" {
			return &rest.Error{http.StatusNotFound, "School doesn't have curriculum", err}
		}

		// Delete the whole curriculum tree.
		if err = env.db.Delete(&(school.Curriculum)); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed to delete curriculum", err}
		}
		return nil
	}}
}

func getCurriculum(env Env) rest.Handler {
	type responseBody struct {
		Id   string `json:"id"`
		Name string `json:"name"`
	}
	return rest.Handler{env.logger, func(w http.ResponseWriter, r *http.Request) *rest.Error {
		// Get school id
		schoolId := chi.URLParam(r, "schoolId")

		// Get school data and check if curriculum exists
		var school postgres.School
		err := env.db.Model(&school).
			Relation("Curriculum").
			Where("school.id=?", schoolId).
			Select()
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed to get school data", err}
		}

		// Don't do anything if school doesn't have curriculum yet
		if school.CurriculumId == "" {
			return &rest.Error{http.StatusNotFound, "School doesn't have curriculum yet", err}
		}

		// Format queried result into response format.
		response := responseBody{school.CurriculumId, school.Curriculum.Name}
		if err = rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	}}
}

func getCurriculumAreas(env Env) rest.Handler {
	type simplifiedArea struct {
		Id   string `json:"id"`
		Name string `json:"name"`
	}
	return rest.Handler{env.logger, func(w http.ResponseWriter, r *http.Request) *rest.Error {
		// Get school id
		schoolId := chi.URLParam(r, "schoolId")

		// Get school data and check if curriculum exists
		var school postgres.School
		if err := env.db.Model(&school).
			Where("id=?", schoolId).
			Select(); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed to get school data", err}
		}

		// Don't do anything if school doesn't have curriculum yet
		if school.CurriculumId == "" {
			if err := rest.WriteJson(w, make([]simplifiedArea, 0)); err != nil {
				return &rest.Error{http.StatusInternalServerError, "Failed to write json response", err}
			}
			return nil
		}

		var areas []postgres.Area
		if err := env.db.Model(&areas).
			Where("curriculum_id=?", school.CurriculumId).
			Select(); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed to get area data", err}
		}

		// Format queried result into response format.
		var response []simplifiedArea
		for _, area := range areas {
			response = append(response, simplifiedArea{
				Id:   area.Id,
				Name: area.Name,
			})
		}

		if err := rest.WriteJson(w, response); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed to write json response", err}
		}
		return nil
	}}
}
