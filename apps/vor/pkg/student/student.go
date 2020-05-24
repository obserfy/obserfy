package student

import (
	"net/http"
	"time"

	"github.com/chrsep/vor/pkg/auth"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	richErrors "github.com/pkg/errors"
)

func NewRouter(s rest.Server, store Store) *chi.Mux {
	r := chi.NewRouter()
	r.Route("/{studentId}", func(r chi.Router) {
		r.Use(authorizationMiddleware(s, store))
		r.Method("GET", "/", getStudent(s, store))
		r.Method("DELETE", "/", deleteStudent(s, store))
		// TODO:Use PATCH instead of PUT, and implement UPSERT
		r.Method("PUT", "/", putStudent(s, store))
		r.Method("POST", "/observations", postObservation(s, store))
		r.Method("GET", "/observations", getObservation(s, store))
		r.Method("POST", "/attendance", registerAttendance(s, store))
		r.Method("GET", "/attendance", getAttendance(s, store))
		r.Method("GET", "/materialsProgress", getMaterialProgress(s, store))
		r.Method("PATCH", "/materialsProgress/{materialId}", upsertMaterialProgress(s, store))

		r.Method("POST", "/guardianRelations", postNewGuardianRelation(s, store))
		r.Method("DELETE", "/guardianRelations/{guardianId}", deleteGuardianRelation(s, store))
	})
	return r
}

func authorizationMiddleware(s rest.Server, store Store) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
			studentId := chi.URLParam(r, "studentId")

			// Verify user access to the school
			session, ok := auth.GetSessionFromCtx(r.Context())
			if !ok {
				return auth.NewGetSessionError()
			}

			// Check if user is related to the school
			userHasAccess, err := store.CheckPermissions(studentId, session.UserId)
			if err != nil {
				return &rest.Error{http.StatusInternalServerError, "Internal Server Error", err}
			}
			if !userHasAccess {
				return &rest.Error{http.StatusNotFound, "We can't find the specified student", err}
			}

			next.ServeHTTP(w, r)
			return nil
		})
	}
}
func registerAttendance(s rest.Server, store Store) http.Handler {
	type requestBody struct {
		StudentId string    `json:"studentId"`
		ClassId   string    `json:"classId"`
		Date      time.Time `json:"date"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		var requestBody requestBody
		if err := rest.ParseJson(r.Body, &requestBody); err != nil {
			return rest.NewParseJsonError(err)
		}
		attendance, err := store.InsertAttendance(requestBody.StudentId, requestBody.ClassId, requestBody.Date)
		if err != nil {
			return &rest.Error{http.StatusNotFound, "Can't create attendance", err}
		}
		if err := rest.WriteJson(w, attendance); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}
func getAttendance(s rest.Server, store Store) http.Handler {

	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		id := chi.URLParam(r, "studentId")
		attendance, err := store.GetAttendance(id)
		if err != nil {
			return &rest.Error{http.StatusNotFound, "Can't find attendance", err}
		}
		if err := rest.WriteJson(w, attendance); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func postNewGuardianRelation(s rest.Server, store Store) http.Handler {
	type requestBody struct {
		Id           string `json:"id"`
		Relationship int    `json:"relationship"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		studentId := chi.URLParam(r, "studentId")

		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}

		if err := store.InsertGuardianRelation(studentId, body.Id, body.Relationship); err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "failed to save relationship",
				Error:   err,
			}
		}

		w.WriteHeader(http.StatusCreated)
		return nil
	})
}

func deleteGuardianRelation(s rest.Server, store Store) http.Handler {
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		studentId := chi.URLParam(r, "studentId")
		guardianId := chi.URLParam(r, "guardianId")

		if err := store.DeleteGuardianRelation(studentId, guardianId); err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "failed to delete relationship",
				Error:   err,
			}
		}

		w.WriteHeader(http.StatusNoContent)
		return nil
	})
}

func getStudent(s rest.Server, store Store) http.Handler {
	type Guardian struct {
		Id           string `json:"id"`
		Name         string `json:"name"`
		Relationship int    `json:"relationship"`
		Email        string `json:"email"`
	}
	type Class struct {
		Id   string `json:"id"`
		Name string `json:"name"`
	}
	type responseBody struct {
		Id          string     `json:"id"`
		Name        string     `json:"name"`
		DateOfBirth *time.Time `json:"dateOfBirth,omitempty"`
		DateOfEntry *time.Time `json:"dateOfEntry,omitempty"`
		Gender      int        `json:"gender"`
		Note        string     `json:"note"`
		CustomId    string     `json:"customId"`
		Active      bool       `json:"active"`
		ProfilePic  string     `json:"profilePic"`
		Classes     []Class    `json:"classes"`
		Guardians   []Guardian `json:"guardians"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		id := chi.URLParam(r, "studentId")

		student, err := store.Get(id)
		if err != nil {
			return &rest.Error{http.StatusNotFound, "Can't find student with specified id", err}
		}

		guardians := make([]Guardian, len(student.Guardians))
		for i, guardian := range student.Guardians {
			relation, err := store.GetGuardianRelation(id, guardian.Id)
			if err != nil {
				return &rest.Error{
					Code:    http.StatusInternalServerError,
					Message: "can't find student to guardian relatin",
					Error:   err,
				}
			}
			guardians[i] = Guardian{
				Id:           guardian.Id,
				Name:         guardian.Name,
				Relationship: int(relation.Relationship),
				Email:        guardian.Email,
			}
		}
		classes := make([]Class, len(student.Classes))
		for i, class := range student.Classes {
			classes[i] = Class{
				Id:   class.Id,
				Name: class.Name,
			}
		}
		response := responseBody{
			Id:          student.Id,
			Name:        student.Name,
			Gender:      int(student.Gender),
			CustomId:    student.CustomId,
			Note:        student.Note,
			DateOfBirth: student.DateOfBirth,
			DateOfEntry: student.DateOfEntry,
			Guardians:   guardians,
			Classes:     classes,
		}
		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func deleteStudent(s rest.Server, store Store) http.Handler {
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		studentId := chi.URLParam(r, "studentId") // from a route like /users/{userID}
		if err := store.DeleteStudent(studentId); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed deleting student", err}
		}
		return nil
	})
}

func putStudent(s rest.Server, store Store) http.Handler {
	type requestBody struct {
		Name        string     `json:"name"`
		DateOfBirth *time.Time `json:"dateOfBirth"`
		DateOfEntry *time.Time      `json:"dateOfEntry"`
		CustomId    string          `json:"customId"`
		Gender      postgres.Gender `json:"gender"`
	}
	type responseBody struct {
		Id          string     `json:"id"`
		Name        string     `json:"name"`
		DateOfBirth *time.Time `json:"dateOfBirth,omitempty"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		targetId := chi.URLParam(r, "studentId") // from a route like /users/{userID}

		var requestBody requestBody
		if err := rest.ParseJson(r.Body, &requestBody); err != nil {
			return rest.NewParseJsonError(err)
		}

		oldStudent, err := store.Get(targetId)
		if err != nil {
			return &rest.Error{http.StatusNotFound, "Can't find old student data", err}
		}

		newStudent := oldStudent
		newStudent.Name = requestBody.Name
		newStudent.DateOfBirth = requestBody.DateOfBirth
		newStudent.Gender = requestBody.Gender
		newStudent.CustomId = requestBody.CustomId
		newStudent.DateOfEntry = requestBody.DateOfEntry

		if err := store.UpdateStudent(newStudent); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed updating old student data", err}
		}

		response := responseBody{
			Id:          newStudent.Id,
			Name:        newStudent.Name,
			DateOfBirth: newStudent.DateOfBirth,
		}
		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func postObservation(s rest.Server, store Store) http.Handler {
	type requestBody struct {
		ShortDesc  string     `json:"shortDesc"`
		LongDesc   string     `json:"longDesc"`
		CategoryId string     `json:"categoryId"`
		EventTime  *time.Time `json:"eventTime"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		id := chi.URLParam(r, "studentId")
		session, ok := auth.GetSessionFromCtx(r.Context())
		if !ok {
			return &rest.Error{
				http.StatusUnauthorized,
				"You don't have access to this student",
				richErrors.New("user is not authorized to add observation."),
			}
		}

		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}

		var eventTime *time.Time
		if body.EventTime == nil {
			currentTime := time.Now()
			eventTime = &currentTime
		} else {
			eventTime = body.EventTime
		}
		observation, err := store.InsertObservation(id,
			session.UserId,
			body.LongDesc,
			body.ShortDesc,
			body.CategoryId,
			eventTime,
		)
		if err != nil {
			return &rest.Error{
				http.StatusInternalServerError,
				"Failed inserting observation",
				err,
			}
		}

		w.WriteHeader(http.StatusCreated)
		if err := rest.WriteJson(w, observation); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func getObservation(s rest.Server, store Store) http.Handler {
	type observation struct {
		Id          string     `json:"id"`
		StudentName string     `json:"studentName"`
		CategoryId  string     `json:"categoryId"`
		CreatorId   string     `json:"creatorId,omitempty"`
		CreatorName string     `json:"creatorName,omitempty"`
		LongDesc    string     `json:"longDesc"`
		ShortDesc   string     `json:"shortDesc"`
		CreatedDate time.Time  `json:"createdDate"`
		EventTime   *time.Time `json:"eventTime,omitempty"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		id := chi.URLParam(r, "studentId")

		observations, err := store.GetObservations(id)
		if err != nil {
			return &rest.Error{
				http.StatusInternalServerError,
				"Fail to query students",
				err,
			}
		}

		responseBody := make([]observation, len(observations))
		for i, o := range observations {
			responseBody[i].Id = o.Id
			responseBody[i].StudentName = o.Student.Name
			responseBody[i].CategoryId = o.CategoryId
			responseBody[i].LongDesc = o.LongDesc
			responseBody[i].ShortDesc = o.ShortDesc
			responseBody[i].EventTime = o.EventTime
			responseBody[i].CreatedDate = o.CreatedDate
			if o.CreatorId != "" {
				responseBody[i].CreatorId = o.CreatorId
				responseBody[i].CreatorName = o.Creator.Name
			}
		}

		if err := rest.WriteJson(w, responseBody); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func getMaterialProgress(s rest.Server, store Store) http.Handler {
	type responseBody struct {
		AreaId       string    `json:"areaId"`
		MaterialName string    `json:"materialName"`
		MaterialId   string    `json:"materialId"`
		Stage        int       `json:"stage"`
		UpdatedAt    time.Time `json:"updatedAt"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		studentId := chi.URLParam(r, "studentId")
		//areaId := r.URL.Query().Get("areaId")

		progress, err := store.GetProgress(studentId)
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed querying material", err}
		}

		// return empty array when there is no data
		response := make([]responseBody, 0)
		for _, progress := range progress {
			response = append(response, responseBody{
				AreaId:       progress.Material.Subject.Area.Id,
				MaterialName: progress.Material.Name,
				MaterialId:   progress.MaterialId,
				Stage:        progress.Stage,
				UpdatedAt:    progress.UpdatedAt,
			})
		}

		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func upsertMaterialProgress(s rest.Server, store Store) http.Handler {
	type requestBody struct {
		Stage int `json:"stage"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		studentId := chi.URLParam(r, "studentId")
		materialId := chi.URLParam(r, "materialId")

		var requestBody requestBody
		if err := rest.ParseJson(r.Body, &requestBody); err != nil {
			return rest.NewParseJsonError(err)
		}

		progress := postgres.StudentMaterialProgress{
			MaterialId: materialId,
			StudentId:  studentId,
			Stage:      requestBody.Stage,
			UpdatedAt:  time.Now(),
		}
		if _, err := store.UpdateProgress(progress); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed updating progress", err}
		}
		return nil
	})
}
