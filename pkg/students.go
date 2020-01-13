package main

import (
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
	r.Get("/{id}/materialsProgress", getStudentProgress(env))
	r.Put("/{id}/materialsProgress/{materialId}", updateMaterialProgress(env))
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
	type requestBody struct {
		Name string `json:"name"`
	}
	return func(w http.ResponseWriter, r *http.Request) {
		targetId := chi.URLParam(r, "id") // from a route like /users/{userID}

		var requestBody requestBody
		if ok := parseJsonRequestBody(w, r, &requestBody, env.logger); !ok {
			return
		}

		var oldStudent Student
		err := env.db.Model(&oldStudent).Where("id=?", targetId).Select()
		if err != nil {
			writeInternalServerError("Failed querying old student data", w, err, env.logger)
			return
		}

		newStudent := oldStudent
		newStudent.Name = requestBody.Name
		err = env.db.Update(&newStudent)
		if err != nil {
			writeInternalServerError("Failed update student", w, err, env.logger)
			return
		}

		err = writeJsonResponse(w, newStudent, env.logger)
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

		err = writeJsonResponse(w, student, env.logger)
	}
}

func addObservationToStudent(env Env) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var requestBody struct {
			ShortDesc  string `json:"shortDesc"`
			LongDesc   string `json:"longDesc"`
			CategoryId string `json:"categoryId"`
		}
		if ok := parseJsonRequestBody(w, r, &requestBody, env.logger); !ok {
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
			CategoryId:  requestBody.CategoryId,
			CreatedDate: time.Now(),
		}
		err = env.db.Insert(&observation)
		if err != nil {
			env.logger.Error("Error inserting observation", zap.Error(err))
			http.Error(w, "Something went wrong", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		err = writeJsonResponse(w, observation, env.logger)
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

		err = writeJsonResponse(w, observations, env.logger)
	}
}

func getStudentProgress(env Env) http.HandlerFunc {
	type responseBody struct {
		AreaId       string    `json:"areaId"`
		MaterialName string    `json:"materialName"`
		MaterialId   string    `json:"materialId"`
		Stage        int       `json:"stage"`
		UpdatedAt    time.Time `json:"updatedAt"`
	}
	return func(w http.ResponseWriter, r *http.Request) {
		studentId := chi.URLParam(r, "id")
		//areaId := r.URL.Query().Get("areaId")

		var progresses []StudentMaterialProgress
		err := env.db.Model(&progresses).
			Relation("Material").
			Relation("Material.Subject").
			Relation("Material.Subject.Area").
			Where("student_id=?", studentId).
			Select()

		// return empty array when there is no data
		if err != nil {
			writeInternalServerError("Failed querying material", w, err, env.logger)
			return
		}

		response := make([]responseBody, 0)
		for _, progress := range progresses {
			response = append(response, responseBody{
				AreaId:       progress.Material.Subject.Area.Id,
				MaterialName: progress.Material.Name,
				MaterialId:   progress.MaterialId,
				Stage:        progress.Stage,
				UpdatedAt:    progress.UpdatedAt,
			})
		}

		_ = writeJsonResponse(w, response, env.logger)
	}
}

func updateMaterialProgress(env Env) http.HandlerFunc {
	type requestBody struct {
		Stage int `json:"stage"`
	}
	return func(w http.ResponseWriter, r *http.Request) {
		studentId := chi.URLParam(r, "id")
		materialId := chi.URLParam(r, "materialId")

		var requestBody requestBody
		if ok := parseJsonRequestBody(w, r, &requestBody, env.logger); !ok {
			response := createErrorResponse("BadRequest", "Invalid request body.")
			_ = writeJsonResponse(w, response, env.logger)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		progress := StudentMaterialProgress{
			MaterialId: materialId,
			StudentId:  studentId,
			Stage:      requestBody.Stage,
			UpdatedAt:  time.Now(),
		}
		_, err := env.db.Model(&progress).
			OnConflict("(material_id, student_id) DO UPDATE").
			Insert()
		if err != nil {
			writeInternalServerError("Failed updating student progress", w, err, env.logger)
		}
	}
}
