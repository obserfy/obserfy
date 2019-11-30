package main

import (
	"github.com/go-chi/chi"
	"github.com/go-pg/pg/v9"
	_ "github.com/volatiletech/authboss/register"
	"go.uber.org/zap"
	"net/http"
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

	env := Env{db: db, logger: logger}

	createSchema(env)

	r := chi.NewRouter()
	frontendFileServer := http.FileServer(http.Dir("frontend/public")).ServeHTTP
	authboss, authSubroute := setupAuthboss("/auth", env)

	r.Use(authboss.LoadClientStateMiddleware)
	r.Mount("/auth", authSubroute)
	r.Route("/api/v1", func(r chi.Router) {
		r.Mount("/students", getStudentsSubroute(env))
	})
	r.Get("/*", frontendFileServer)

	runServer(r, env)
}

func runServer(r *chi.Mux, env Env) {
	err := http.ListenAndServe(":8080", r)
	if err != nil {
		env.logger.Error("Failed serving router", zap.Error(err))
	}
}
