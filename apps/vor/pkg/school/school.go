package school

import (
	"errors"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-pg/pg/v9"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	richErrors "github.com/pkg/errors"

	"github.com/chrsep/vor/pkg/auth"
	"github.com/chrsep/vor/pkg/imgproxy"
	"github.com/chrsep/vor/pkg/minio"
	"github.com/chrsep/vor/pkg/rest"
)

func NewRouter(
	server rest.Server,
	store Store,
	imageStorage StudentImageStorage,
	imgproxyClient *imgproxy.Client,
) *chi.Mux {
	r := chi.NewRouter()
	r.Method("POST", "/", postNewSchool(server, store))
	r.Route("/{schoolId}", func(r chi.Router) {
		r.Use(authorizationMiddleware(server, store))
		r.Method("GET", "/", getSchool(server, store))
		r.Method("GET", "/students", getStudents(server, store, imgproxyClient))
		r.Method("POST", "/students", postNewStudent(server, store, imageStorage))
		r.Method("POST", "/invite-code", refreshInviteCode(server, store))

		// TODO: This might fit better in curriculum package, revisit later
		r.Method("POST", "/curriculum", postNewCurriculum(server, store))
		r.Method("DELETE", "/curriculum", deleteCurriculum(server, store))
		r.Method("GET", "/curriculum", getCurriculum(server, store))
		r.Method("GET", "/curriculum/areas", getCurriculumAreas(server, store))

		r.Method("POST", "/class", postNewClass(server, store))
		r.Method("GET", "/class", getClasses(server, store))

		r.Method("GET", "/class/{classId}/attendance/{session}", getClassAttendance(server, store))

		r.Method("POST", "/guardians", postNewGuardian(server, store))
		r.Method("GET", "/guardians", getGuardians(server, store))

		r.Method("GET", "/plans", getLessonPlan(server, store))

		r.Method("POST", "/files", addFile(server, store))
		r.Method("PATCH", "/files/{fileId}", updateFile(server, store))
		r.Method("DELETE", "/files/{fileId}", deleteFile(server, store))
	})
	return r
}

func getClasses(server rest.Server, store Store) http.Handler {
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
func getClassAttendance(server rest.Server, store Store) http.Handler {
	type attendanceData struct {
		StudentId string `json:"studentId"`
		Name      string `json:"name"`
		Attend    bool   `json:"attend"`
	}

	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		session := chi.URLParam(r, "session")
		classId := chi.URLParam(r, "classId")
		attendance, err := store.GetClassAttendance(classId, session)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "failed querying attendance",
				Error:   err,
			}
		}
		var response []attendanceData
		attendMap := make(map[string]int)
		if len(attendance) > 0 {
			students := attendance[0].Class.Students
			for _, attendance := range attendance {
				attendMap[attendance.StudentId] = 1
			}
			for _, student := range students {
				if attendMap[student.Id] != 1 {
					response = append(response, attendanceData{
						StudentId: student.Id,
						Name:      student.Name,
						Attend:    false,
					})
				} else {
					response = append(response, attendanceData{
						StudentId: student.Id,
						Name:      student.Name,
						Attend:    true,
					})
				}
			}
		}
		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func postNewClass(s rest.Server, store Store) http.Handler {
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

func postNewSchool(s rest.Server, store Store) rest.Handler {
	var requestBody struct {
		Name string
	}

	type responseBody struct {
		Id   string `json:"id"`
		Name string `json:"name"`
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
		if err := rest.WriteJson(w, responseBody{
			Id:   school.Id,
			Name: school.Name,
		}); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func authorizationMiddleware(s rest.Server, store Store) func(next http.Handler) http.Handler {
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

func getSchool(s rest.Server, store Store) rest.Handler {
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

func getStudents(s rest.Server, store Store, imgproxyClient *imgproxy.Client) rest.Handler {
	type responseBody struct {
		Id            string     `json:"id"`
		Name          string     `json:"name"`
		DateOfBirth   *time.Time `json:"dateOfBirth,omitempty"`
		ProfilePicUrl string     `json:"profilePicUrl,omitempty"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		schoolId := chi.URLParam(r, "schoolId")

		students, err := store.GetStudents(schoolId)
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed getting all students", err}
		}

		response := make([]responseBody, 0)
		for _, student := range students {
			profilePicUrl := ""
			if student.ProfilePic != "" {
				profilePicUrl = imgproxyClient.GenerateUrl(student.ProfilePic, 80, 80)
			}
			response = append(response, responseBody{
				Id:            student.Id,
				Name:          student.Name,
				DateOfBirth:   student.DateOfBirth,
				ProfilePicUrl: profilePicUrl,
			})
		}
		if err = rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func postNewStudent(s rest.Server, store Store, storage StudentImageStorage) rest.Handler {
	type studentField struct {
		Name        string     `json:"name"`
		DateOfBirth *time.Time `json:"dateOfBirth"`
		DateOfEntry *time.Time `json:"dateOfEntry"`
		CustomId    string     `json:"customId"`
		Classes     []string   `json:"classes"`
		Note        string     `json:"note"`
		Gender      Gender     `json:"gender"`
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

		err = store.NewStudent(Student{
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

func refreshInviteCode(s rest.Server, store Store) http.Handler {
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

func postNewCurriculum(s rest.Server, store Store) http.Handler {
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

func deleteCurriculum(s rest.Server, store Store) rest.Handler {
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		// Get school id
		schoolId := chi.URLParam(r, "schoolId")

		// Get school data and check if curriculum exists
		err := store.DeleteCurriculum(schoolId)
		if errors.Is(EmptyCurriculumError, err) {
			return &rest.Error{http.StatusNotFound, "School doesn't have curriculum yet", err}
		} else if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed to get school data", err}
		}

		return nil
	})
}

func getCurriculum(s rest.Server, store Store) rest.Handler {
	type responseBody struct {
		Id   string `json:"id"`
		Name string `json:"name"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		// Get school id
		schoolId := chi.URLParam(r, "schoolId")

		// Get school data and check if curriculum exists
		c, err := store.GetCurriculum(schoolId)
		if errors.Is(EmptyCurriculumError, err) {
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

func getCurriculumAreas(s rest.Server, store Store) rest.Handler {
	type simplifiedArea struct {
		Id   string `json:"id"`
		Name string `json:"name"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		// Get school id
		schoolId := chi.URLParam(r, "schoolId")

		// Get school data and check if curriculum exists
		areas, err := store.GetCurriculumAreas(schoolId)
		if errors.Is(EmptyCurriculumError, err) {
			emptyArray := make([]Area, 0)
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

func postNewGuardian(server rest.Server, store Store) http.Handler {
	type requestBody struct {
		Name  string `json:"name" validate:"required"`
		Email string `json:"email"`
		Phone string `json:"phone"`
		Note  string `json:"note"`
		// Uses pointer to allow nil, relation is optional
		StudentId    *string `json:"studentId"`
		Relationship *int    `json:"relationship"`
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

		guardianInput := GuardianWithRelation{
			SchoolId:     schoolId,
			Name:         body.Name,
			Email:        body.Email,
			Phone:        body.Phone,
			Note:         body.Note,
			Relationship: body.Relationship,
			StudentId:    body.StudentId,
		}

		newGuardian, err := store.InsertGuardianWithRelation(guardianInput)
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

func getGuardians(server rest.Server, store Store) http.Handler {
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

func getLessonPlan(server rest.Server, store Store) http.Handler {
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		type responseBody struct {
			Id          string    `json:"id"`
			Title       string    `json:"title"`
			Description string    `json:"description"`
			ClassName   string    `json:"className"`
			StartTime   time.Time `json:"startTime"`
		}
		schoolId := chi.URLParam(r, "schoolId")
		date := r.URL.Query().Get("date")
		lessonPlans, err := store.GetLessonPlans(schoolId, date)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "Failed to query lesson plan",
				Error:   err,
			}
		}
		response := make([]responseBody, len(lessonPlans))
		for i, plan := range lessonPlans {
			response[i] = responseBody{
				Id:          plan.Id,
				Title:       plan.Title,
				Description: plan.Description,
				StartTime:   plan.StartTime,
				ClassName:   plan.ClassName,
			}
		}
		rest.WriteJson(w, response)
		return nil
	})
}

func addFile(server rest.Server, store Store) http.Handler {
	type reqBody struct {
		FileName string `json:"fileName"`
	}

	type resBody struct {
		FileId   string `json:"fileId"`
		SchoolId string `json:"schoolId"`
		FileName string `json:"fileName"`
	}

	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		body := reqBody{}
		schoolId := chi.URLParam(r, "schoolId")

		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}

		if body.FileName == "" {
			return &rest.Error{
				Code:    http.StatusBadRequest,
				Message: "File name must not empty",
			}
		}

		res, err := store.CreateFile(schoolId, body.FileName)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "Failed create file",
				Error:   err,
			}
		}

		w.WriteHeader(http.StatusCreated)
		if err := rest.WriteJson(w, &resBody{
			FileId:   res.FileId,
			SchoolId: res.SchoolId,
			FileName: res.FileName,
		}); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func updateFile(server rest.Server, store Store) http.Handler {
	type reqBody struct {
		FileName string `json:"fileName"`
	}

	type resBody struct {
		FileId   string `json:"fileId"`
		SchoolId string `json:"schoolId"`
		FileName string `json:"fileName"`
	}

	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		body := reqBody{}
		fileId := chi.URLParam(r, "fileId")

		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}

		if body.FileName == "" {
			return &rest.Error{
				Code:    http.StatusBadRequest,
				Message: "File name must not empty",
			}
		}

		res, err := store.UpdateFile(fileId, body.FileName)
		if err != nil {
			if err == pg.ErrNoRows {
				return &rest.Error{
					Code:    http.StatusNotFound,
					Message: "File not found",
					Error:   err,
				}
			}
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "Failed update file",
				Error:   err,
			}
		}

		w.WriteHeader(http.StatusOK)
		if err := rest.WriteJson(w, &resBody{
			FileId:   res.FileId,
			SchoolId: res.SchoolId,
			FileName: res.FileName,
		}); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func deleteFile(server rest.Server, store Store) http.Handler {
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		fileId := chi.URLParam(r, "fileId")

		err := store.DeleteFile(fileId)
		if err != nil {
			if err == pg.ErrNoRows {
				return &rest.Error{
					Code:    http.StatusNotFound,
					Message: "No file found",
					Error:   err,
				}
			}
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "Failed to delete file",
				Error:   err,
			}
		}

		w.WriteHeader(http.StatusOK)
		return nil
	})
}