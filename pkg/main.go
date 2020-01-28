package main

import (
	"github.com/chrsep/vor/pkg/auth"
	"github.com/chrsep/vor/pkg/curriculum"
	"github.com/chrsep/vor/pkg/observation"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/chrsep/vor/pkg/school"
	"github.com/chrsep/vor/pkg/student"
	"github.com/chrsep/vor/pkg/user"
	"github.com/getsentry/sentry-go"
	sentryhttp "github.com/getsentry/sentry-go/http"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	_ "github.com/joho/godotenv/autoload"
	"go.uber.org/zap"
	"log"
	"net/http"
	"os"
)

func main() {
	if err := runServer(); err != nil {
		log.Printf("Logging error: %s\n", err)
	}
}

func runServer() error {
	// Setup uber zap logger
	logger := NewLogger()
	defer SyncLogger(logger)

	// Setup db connection
	db := postgres.Connect()
	defer func() {
		if err := db.Close(); err != nil {
			logger.Error("Failed closing db", zap.Error(err))
		}
	}()

	// Initialize tables
	if err := postgres.InitTables(db); err != nil {
		return err
	}

	// Setup sentry
	sentryOptions := sentry.ClientOptions{Dsn: os.Getenv("SENTRY_DSN")}
	if err := sentry.Init(sentryOptions); err != nil {
		return err
	}
	sentryHandler := sentryhttp.New(sentryhttp.Options{})

	// Setup server and stores
	server := rest.NewServer(logger)
	studentStore := postgres.StudentStore{db}
	observationStore := postgres.ObservationStore{db}
	schoolStore := postgres.SchoolStore{db}
	userStore := postgres.UserStore{db}
	curriculumStore := postgres.CurriculumStore{db}
	authStore := postgres.AuthStore{db}

	// Setup routing
	r := chi.NewRouter()
	r.Use(middleware.Heartbeat("/ping"))
	r.Use(middleware.GetHead)
	r.Use(sentryHandler.Handle)
	r.Mount("/auth", auth.NewRouter(server, authStore))
	r.Route("/api/v1", func(r chi.Router) {
		r.Use(auth.NewMiddleware(server, authStore))
		r.Mount("/students", student.NewRouter(server, studentStore))
		r.Mount("/observations", observation.NewRouter(server, observationStore))
		r.Mount("/schools", school.NewRouter(server, schoolStore))
		r.Mount("/user", user.NewRouter(server, userStore))
		r.Mount("/curriculum", curriculum.NewRouter(server, curriculumStore))
	})
	r.Group(func(r chi.Router) {
		frontendFolder := "./frontend/public"
		r.Use(createFrontendAuthMiddleware(db, frontendFolder))
		r.Get("/*", createFrontendFileServer(frontendFolder))
	})

	// Run the server
	if err := http.ListenAndServe(":8080", r); err != nil {
		return err
	}
	return nil
}
