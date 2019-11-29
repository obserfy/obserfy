package main

import (
	"encoding/json"
	"fmt"
	"github.com/go-chi/chi"
	"github.com/go-pg/pg/v9"
	"github.com/go-pg/pg/v9/orm"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"log"
	"net/http"
	"os"
	"strings"
)

type Env struct {
	db     *pg.DB
	logger *zap.Logger
}

func main() {
	logger := createLogger()
	defer syncLogger(logger)

	db := getDBConnection()
	defer closeDB(db, logger)

	env := Env{
		db:     db,
		logger: logger,
	}

	createSchema(env)

	r := chi.NewRouter()
	r.Route("/api", func(r chi.Router) {
		r.Route("/v1", func(r chi.Router) {
			r.Route("/students", func(r chi.Router) {
				r.Get("/", getAllStudents(env))
				r.Get("/:id", getStudentById(env))
				r.Post("/", createNewStudent(env))
				r.Delete("/:id", deleteStudent(env))
				r.Patch("/:id", updateStudent(env))
			})
		})
	})

	serveFrontend(r, "/", http.Dir("frontend/public"))
	err := http.ListenAndServe(":8080", r)
	if err != nil {
		logger.Error("Failed serving router", zap.Error(err))
	}
}

func getAllStudents(env Env) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var students []Student
		err := env.db.Model(&students).Select()
		if err != nil {
			env.logger.Error("Error getting all students", zap.Error(err))
		}

		res, err := json.Marshal(students)
		if err != nil {
			env.logger.Error("Error marshaling students", zap.Error(err))
		}

		_, err = w.Write(res)
		if err != nil {
			env.logger.Error("Error writing response", zap.Error(err))
		}
	}
}

type StudentPostBody struct {
	Name string `json:"name"`
}

func createNewStudent(env Env) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var requestBody StudentPostBody
		err := json.NewDecoder(r.Body).Decode(&requestBody)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		student := Student{
			Id:   uuid.New().String(),
			Name: requestBody.Name,
		}
		err = env.db.Insert(&student)
		if err != nil {
			env.logger.Error("Failed creating new student", zap.Error(err))
		}
	}
}

func deleteStudent(env Env) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

	}
}

func updateStudent(env Env) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

	}
}

func getStudentById(env Env) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

	}
}

func serveFrontend(r chi.Router, path string, root http.FileSystem) {
	if strings.ContainsAny(path, "{}*") {
		panic("FileServer does not permit URL parameters.")
	}

	fs := http.StripPrefix(path, http.FileServer(root))

	if path != "/" && path[len(path)-1] != '/' {
		r.Get(path, http.RedirectHandler(path+"/", 301).ServeHTTP)
		path += "/"
	}
	path += "*"

	r.Get(path, func(w http.ResponseWriter, r *http.Request) {
		fs.ServeHTTP(w, r)
	})
}

type Student struct {
	Id   string `json:"id" sql:",type:uuid"`
	Name string `json:"name"`
}

func getDBConnection() *pg.DB {
	return pg.Connect(&pg.Options{
		User:     os.Getenv("DB_USERNAME"),
		Password: os.Getenv("DB_PASSWORD"),
		Addr:     os.Getenv("DB_HOST") + ":" + os.Getenv("DB_PORT"),
		Database: "main",
	})
}

func closeDB(db *pg.DB, logger *zap.Logger) {
	err := db.Close()
	if err != nil {
		logger.Error("Error closing db", zap.Error(err))
	}
}

func createSchema(env Env) {
	err := env.db.CreateTable((*Student)(nil), &orm.CreateTableOptions{})
	if err != nil {
		env.logger.Error("Failed creating table", zap.Error(err))
	}
}

func createLogger() *zap.Logger {
	logger, err := zap.NewProduction()
	if err != nil {
		log.Print("Failed creating logger")
	}
	return logger
}

func syncLogger(logger *zap.Logger) {
	fmt.Printf("Hello")
	err := logger.Sync()
	if err != nil {
		logger.Error("Failed logger sync")
	}
}
