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
	db           *pg.DB
	logger       *zap.Logger
	studentStore StudentStore
}

const (
	BCryptCost = 10
)

func main() {
	// Setup uber zap logger
	logger := createLogger()
	defer syncLogger(logger)

	// Setup db connection
	db := getDBConnection()
	defer closeDB(db, logger)

	env := Env{
		db:           db,
		logger:       logger,
		studentStore: PgStudentStore{db},
	}

	// run the server
	if err := runServer(env); err != nil {
		logger.Error("Failed running server", zap.Error(err))
	}
}

func runServer(env Env) error {
	// Initialize tables
	createSchema(env)

	// Setup sentry
	sentryOptions := sentry.ClientOptions{Dsn: os.Getenv("SENTRY_DSN")}
	if err := sentry.Init(sentryOptions); err != nil {
		return err
	}
	sentryHandler := sentryhttp.New(sentryhttp.Options{})

	// Setup routing
	r := chi.NewRouter()
	r.Use(sentryHandler.Handle)
	r.Route("/api/v1", func(r chi.Router) {
		r.Use(createAuthMiddleware(env))
		r.Mount("/students", createStudentsSubroute(env))
		r.Mount("/observations", createObservationsSubroute(env))
		r.Mount("/schools", createSchoolsSubroute(env))
		r.Mount("/user", createUserSubroute(env))
		r.Mount("/curriculum", createCurriculumSubroute(env))
	})
	r.Mount("/auth", createAuthSubroute(env))
	r.Group(func(r chi.Router) {
		frontendFolder := "./frontend/public"
		r.Use(createFrontendAuthMiddleware(env, frontendFolder))
		r.Get("/*", createFrontendFileServer(frontendFolder))
	})

	// Run the server
	if err := http.ListenAndServe(":8080", r); err != nil {
		return err
	}
	return nil
}
