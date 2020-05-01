package school

import (
	"errors"
	"github.com/chrsep/vor/pkg/auth"
	"github.com/chrsep/vor/pkg/minio"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"github.com/go-pg/pg/v9"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	richErrors "github.com/pkg/errors"
	"net/http"
	"os"
	"time"
)

func NewRouter(server rest.Server, store postgres.SchoolStore, imageStorage StudentImageStorage) *chi.Mux {
	r := chi.NewRouter()
	r.Method("POST", "/", postNewSchool(server, store))
	r.Route("/{schoolId}", func(r chi.Router) {
		r.Use(authorizationMiddleware(server, store))
		r.Method("GET", "/", getSchool(server, store))
		r.Method("GET", "/students", getStudents(server, store))
		r.Method("POST", "/students", postNewStudent(server, store, imageStorage))
		r.Method("POST", "/invite-code", refreshInviteCode(server, store))

		// TODO: This might fit better in curriculum package, revisit later
		r.Method("POST", "/curriculum", postNewCurriculum(server, store))
		r.Method("DELETE", "/curriculum", deleteCurriculum(server, store))
		r.Method("GET", "/curriculum", getCurriculum(server, store))
		r.Method("GET", "/curriculum/areas", getCurriculumAreas(server, store))

		r.Method("POST", "/class", postNewClass(server, store))
		r.Method("GET", "/class", getClasses(server, store))
		r.Method("GET", "/class/{classId}/session", getClassSession(server, store))

		r.Method("GET", "/class/{classId}/attendance/{session}", getClassAttendance(server, store))

		r.Method("POST", "/guardians", postNewGuardian(server, store))
		r.Method("GET", "/guardians", getGuardians(server, store))
	})
	return r
}

func getClasses(server rest.Server, store postgres.SchoolStore) http.Handler {
	type responseBody struct {
		Id        string         `json:"id"`
		Name      string         `json:"name"`
		StartTime time.Time      `json:"startTime"`
		EndTime   time.Time      `json:"endTime"`
		Weekdays  []time.Weekday `json:"weekdays"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		schoolId := chi.URLParam(r, "schoolId")

		classes, err := store.GetSchoolClasses(schoolId)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "failed querying classes",
				Error:   err,
			}
		}

		response := make([]responseBody, len(classes))
		for i, class := range classes {
			weekdays := make([]time.Weekday, len(class.Weekdays))
			for f, weekday := range class.Weekdays {
				weekdays[f] = weekday.Day
			}
			response[i] = responseBody{
				Id:        class.Id,
				Name:      class.Name,
				StartTime: class.StartTime,
				EndTime:   class.EndTime,
				Weekdays:  weekdays,
			}
		}

		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}

		return nil
	})
}
func getClassSession(server rest.Server, store postgres.SchoolStore) http.Handler {
	type responseBody struct {
		Date string `json:"date"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		classId := chi.URLParam(r, "classId")
		attendance, err := store.GetClassSession(classId)
		var response []responseBody

		if len(attendance) > 0 {
			for _, attendance := range attendance {
				response = append(response, responseBody{
					Date: attendance.Date.String(),
				})
			}
		}

		if err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "failed querying attendance",
				Error:   err,
			}
		}
		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}

		return nil
	})
}
func getClassAttendance(server rest.Server, store postgres.SchoolStore) http.Handler {
	type responseBody struct {
		StudentId string `json:"studentId"`
		Name      string `json:"name"`
		Absent    bool   `json:"absent"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		session := chi.URLParam(r, "session")
		classId := chi.URLParam(r, "classId")
		attendance, err := store.GetClassAttendance(classId, session)
		var response []responseBody

		if len(attendance) > 0 {
			students := attendance[0].Class.Students
			attend := make(map[string]int)
			for _, attendance := range attendance {
				attend[attendance.StudentId] = 1
				response = append(response, responseBody{
					StudentId: attendance.StudentId,
					Name:      attendance.Student.Name,
					Absent:    true,
				})
			}
			for _, student := range students {
				if attend[student.Id] != 1 {
					response = append(response, responseBody{
						StudentId: student.Id,
						Name:      student.Name,
						Absent:    false,
					})
				}
			}
		}

		if err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "failed querying attendance",
				Error:   err,
			}
		}
		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}

		return nil
	})
}
func postNewClass(s rest.Server, store postgres.SchoolStore) http.Handler {
	type requestBody struct {
		Name      string         `json:"name"`
		StartTime time.Time      `json:"startTime"`
		EndTime   time.Time      `json:"endTime"`
		Weekdays  []time.Weekday `json:"weekdays"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		schoolId := chi.URLParam(r, "schoolId")

		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}

		err := store.NewClass(
			schoolId,
			body.Name,
			body.Weekdays,
			body.StartTime,
			body.EndTime,
		)
		if err != nil {
			return &rest.Error{
				http.StatusInternalServerError,
				"Failed saving new class",
				err,
			}
		}

		w.WriteHeader(http.StatusCreated)
		return nil
	})
}

func postNewSchool(s rest.Server, store postgres.SchoolStore) rest.Handler {
	var requestBody struct {
		Name string
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		session, ok := auth.GetSessionFromCtx(r.Context())
		if !ok {
			return auth.NewGetSessionError()
		}
		if err := rest.ParseJson(r.Body, &requestBody); err != nil {
			return rest.NewParseJsonError(err)
		}

		school, err := store.NewSchool(requestBody.Name, session.UserId)
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "failed saving school data", err}
		}
		w.WriteHeader(http.StatusCreated)
		if err := rest.WriteJson(w, school); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func authorizationMiddleware(s rest.Server, store postgres.SchoolStore) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
			schoolId := chi.URLParam(r, "schoolId")
			if _, err := uuid.Parse(schoolId); err != nil {
				return &rest.Error{
					http.StatusNotFound,
					"Can't find the given school",
					err,
				}
			}

			// Verify user access to the school
			session, ok := auth.GetSessionFromCtx(r.Context())
			if !ok {
				return auth.NewGetSessionError()
			}
			school, err := store.GetSchool(schoolId)
			if err == pg.ErrNoRows {
				return &rest.Error{http.StatusNotFound, "We can't find the specified school", err}
			} else if err != nil {
				return &rest.Error{http.StatusInternalServerError, "Failed getting school", err}
			}

			// Check if user is related to the school
			userHasAccess := false
			for _, user := range school.Users {
				if user.Id == session.UserId {
					userHasAccess = true
					break
				}
			}
			if !userHasAccess {
				return &rest.Error{http.StatusUnauthorized, "You don't have access to this school", err}
			}

			next.ServeHTTP(w, r)
			return nil
		})
	}
}

func getSchool(s rest.Server, store postgres.SchoolStore) rest.Handler {
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

	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		schoolId := chi.URLParam(r, "schoolId")
		session, ok := auth.GetSessionFromCtx(r.Context())
		if !ok {
			return auth.NewGetSessionError()
		}

		// Get school data
		school, err := store.GetSchool(schoolId)
		if err != nil {
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
	})
}

func getStudents(s rest.Server, store postgres.SchoolStore) rest.Handler {
	type responseBody struct {
		Id          string     `json:"id"`
		Name        string     `json:"name"`
		DateOfBirth *time.Time `json:"dateOfBirth,omitempty"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		schoolId := chi.URLParam(r, "schoolId")

		students, err := store.GetStudents(schoolId)
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
	})
}

func postNewStudent(s rest.Server, store postgres.SchoolStore, storage StudentImageStorage) rest.Handler {
	type studentField struct {
		Name        string          `json:"name"`
		DateOfBirth *time.Time      `json:"dateOfBirth"`
		DateOfEntry *time.Time      `json:"dateOfEntry"`
		CustomId    string          `json:"customId"`
		Classes     []string        `json:"classes"`
		Note        string          `json:"note"`
		Gender      postgres.Gender `json:"gender"`
		Guardians   []struct {
			Id           string `json:"id"`
			Relationship int    `json:"relationship"`
		} `json:"guardians"`
	}

	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		_, _ = minio.NewMinioImageStorage()
		schoolId := chi.URLParam(r, "schoolId")
		if err := r.ParseMultipartForm(10 << 20); err != nil {
			return &rest.Error{
				Code:    http.StatusBadRequest,
				Message: "failed to parse payload",
				Error:   richErrors.Wrap(err, "failed to parse response body"),
			}
		}

		newStudentId := uuid.New().String()
		// Save student profile picture
		picture, pictureFileHeader, err := r.FormFile("picture")
		var profilePicPath string
		if err == nil {
			fileHeader := make([]byte, 512)
			if _, err := picture.Read(fileHeader); err != nil {
				return &rest.Error{
					Code:    http.StatusInternalServerError,
					Message: "failed to parse picture header",
					Error:   richErrors.Wrap(err, "failed to parse picture header"),
				}
			}
			mime := http.DetectContentType(fileHeader)
			if mime != "image/png" {
				return &rest.Error{
					Code:    http.StatusBadRequest,
					Message: "profile picture must be a png",
					Error:   richErrors.New("invalid profile picture format"),
				}
			}
			if _, err := picture.Seek(0, 0); err != nil {
				return &rest.Error{
					Code:    http.StatusInternalServerError,
					Message: "failed moving picture buffer seeker to beginning",
					Error:   richErrors.Wrap(err, "failed moving picture buffer seeker to beginning"),
				}
			}
			profilePicPath, err = storage.SaveProfilePicture(newStudentId, picture, pictureFileHeader.Size)
			if err != nil {
				return &rest.Error{
					Code:    http.StatusInternalServerError,
					Message: "failed to save image",
					Error:   richErrors.Wrap(err, "failed to save image"),
				}
			}
		}

		// save student data
		student, _, err := r.FormFile("student")
		if err != nil {
			return &rest.Error{
				Code:    http.StatusBadRequest,
				Message: "failed to parse student data",
				Error:   richErrors.Wrap(err, "failed to parse student form field"),
			}
		}
		var newStudent studentField
		if err := rest.ParseJson(student, &newStudent); err != nil {
			return rest.NewParseJsonError(err)
		}
		guardians := make(map[string]int)
		for _, guardian := range newStudent.Guardians {
			guardians[guardian.Id] = guardian.Relationship
		}
		err = store.NewStudent(postgres.Student{
			Id:          newStudentId,
			Name:        newStudent.Name,
			SchoolId:    schoolId,
			DateOfBirth: newStudent.DateOfBirth,
			Gender:      newStudent.Gender,
			DateOfEntry: newStudent.DateOfEntry,
			Note:        newStudent.Note,
			CustomId:    newStudent.CustomId,
			Active:      true,
			ProfilePic:  profilePicPath,
		}, newStudent.Classes, guardians)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "Failed saving new student",
				Error:   err,
			}
		}

		w.WriteHeader(http.StatusCreated)
		return nil
	})
}

func refreshInviteCode(s rest.Server, store postgres.SchoolStore) http.Handler {
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		schoolId := chi.URLParam(r, "schoolId")

		// Get related school details
		school, err := store.RefreshInviteCode(schoolId)
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed getting school info", err}
		}

		if err := rest.WriteJson(w, school); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func postNewCurriculum(s rest.Server, store postgres.SchoolStore) http.Handler {
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		// Get school id
		schoolId := chi.URLParam(r, "schoolId")

		// Return conflict error if school already has curriculum
		school, err := store.GetSchool(schoolId)
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed to get school data", err}
		}
		if school.CurriculumId != "" {
			return &rest.Error{http.StatusConflict, "School already have curriculum", errors.New("curriculum conflict")}
		}

		// Save default curriculum using transaction
		if err := store.NewDefaultCurriculum(schoolId); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed saving newly created curriculum", err}
		}

		// Return result
		w.WriteHeader(http.StatusCreated)
		return nil
	})
}

func deleteCurriculum(s rest.Server, store postgres.SchoolStore) rest.Handler {
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		// Get school id
		schoolId := chi.URLParam(r, "schoolId")

		// Get school data and check if curriculum exists
		err := store.DeleteCurriculum(schoolId)
		if errors.Is(postgres.EmptyCurriculumError{}, err) {
			return &rest.Error{http.StatusNotFound, "School doesn't have curriculum yet", err}
		} else if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed to get school data", err}
		}

		return nil
	})
}

func getCurriculum(s rest.Server, store postgres.SchoolStore) rest.Handler {
	type responseBody struct {
		Id   string `json:"id"`
		Name string `json:"name"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		// Get school id
		schoolId := chi.URLParam(r, "schoolId")

		// Get school data and check if curriculum exists
		c, err := store.GetCurriculum(schoolId)
		if errors.Is(postgres.EmptyCurriculumError{}, err) {
			return &rest.Error{http.StatusNotFound, "School doesn't have curriculum yet", err}
		} else if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed to get school data", err}
		}

		// Format queried result into response format.
		response := responseBody{c.Id, c.Name}
		if err = rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func getCurriculumAreas(s rest.Server, store postgres.SchoolStore) rest.Handler {
	type simplifiedArea struct {
		Id   string `json:"id"`
		Name string `json:"name"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		// Get school id
		schoolId := chi.URLParam(r, "schoolId")

		// Get school data and check if curriculum exists
		areas, err := store.GetCurriculumAreas(schoolId)
		if errors.Is(postgres.EmptyCurriculumError{}, err) {
			emptyArray := make([]postgres.Area, 0)
			if err = rest.WriteJson(w, emptyArray); err != nil {
				return rest.NewWriteJsonError(err)
			}
			return nil
		}
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed to get school data", err}
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
	})
}

func postNewGuardian(server rest.Server, store postgres.SchoolStore) http.Handler {
	type requestBody struct {
		Name  string `json:"name" validate:"required"`
		Email string `json:"email"`
		Phone string `json:"phone"`
		Note  string `json:"note"`
	}
	type responseBody struct {
		Id    string `json:"id"`
		Name  string `json:"name"`
		Email string `json:"email"`
		Phone string `json:"phone"`
		Note  string `json:"note"`
	}
	validate := validator.New()

	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		schoolId := chi.URLParam(r, "schoolId")

		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}
		if err := validate.Struct(body); err != nil {
			return &rest.Error{
				Code:    http.StatusBadRequest,
				Message: err.Error(),
				Error:   richErrors.Wrap(err, "invalid request body"),
			}
		}

		newGuardian, err := store.NewGuardian(
			schoolId,
			body.Name,
			body.Email,
			body.Phone,
			body.Note,
		)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "failed to save guardian",
				Error:   err,
			}
		}

		w.WriteHeader(http.StatusCreated)
		if err := rest.WriteJson(w, &responseBody{
			Id:    newGuardian.Id,
			Name:  newGuardian.Name,
			Email: newGuardian.Email,
			Phone: newGuardian.Phone,
			Note:  newGuardian.Note,
		}); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func getGuardians(server rest.Server, store postgres.SchoolStore) http.Handler {
	type responseBody struct {
		Id    string `json:"id"`
		Name  string `json:"name"`
		Email string `json:"email"`
		Phone string `json:"phone"`
		Note  string `json:"note"`
	}
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		schoolId := chi.URLParam(r, "schoolId")

		guardians, err := store.GetGuardians(schoolId)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "failed to query guardian",
				Error:   err,
			}
		}

		response := make([]responseBody, len(guardians))
		for i, guardian := range guardians {
			response[i] = responseBody{
				Id:    guardian.Id,
				Name:  guardian.Name,
				Email: guardian.Email,
				Phone: guardian.Phone,
				Note:  guardian.Note,
			}
		}

		if err := rest.WriteJson(w, &response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}
