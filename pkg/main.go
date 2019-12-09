package main

import (
	"github.com/getsentry/sentry-go"
	sentryhttp "github.com/getsentry/sentry-go/http"
	"github.com/go-chi/chi"
	"github.com/go-pg/pg/v9"
	_ "github.com/joho/godotenv/autoload"
	"go.uber.org/zap"
	"net/http"
	"os"
)

type Env struct {
	db     *pg.DB
	logger *zap.Logger
}

const (
	BCryptCost = 10
)

func main() {
	logger := createLogger()
	defer syncLogger(logger)

	db := getDBConnection()
	defer closeDB(db, logger)

	env := Env{db: db, logger: logger}

	// initialize sentry
	if err := sentry.Init(sentry.ClientOptions{
		Dsn: os.Getenv("SENTRY_DSN"),
	}); err != nil {
		env.logger.Error("Failed sentry init", zap.Error(err))
	}
	// Create an instance of sentryhttp
	sentryHandler := sentryhttp.New(sentryhttp.Options{})

	createSchema(env)

	r := chi.NewRouter()

	r.Use(sentryHandler.Handle)
	r.Route("/api/v1", func(r chi.Router) {
		r.Use(createAuthMiddleware(env))
		r.Mount("/students", createStudentsSubroute(env))
		r.Mount("/observations", createObservationsSubroute(env))
		r.Mount("/schools", createSchoolsSubroute(env))
		r.Mount("/user", createUserSubroute(env))
	})
	r.Mount("/auth", createAuthSubroute(env))
	r.Get("/*", createFrontendFileServer())

	runServer(r, env)
}

func runServer(r *chi.Mux, env Env) {
	err := http.ListenAndServe(":8080", r)
	if err != nil {
		env.logger.Error("Failed serving router", zap.Error(err))
	}
}

func createFrontendFileServer() func(w http.ResponseWriter, r *http.Request) {
	return http.FileServer(http.Dir("frontend/public")).ServeHTTP
}
