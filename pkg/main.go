package main

import (
	"crypto/tls"
	"github.com/benbjohnson/clock"
	"github.com/chrsep/vor/pkg/auth"
	"github.com/chrsep/vor/pkg/class"
	"github.com/chrsep/vor/pkg/curriculum"
	"github.com/chrsep/vor/pkg/guardian"
	"github.com/chrsep/vor/pkg/logger"
	"github.com/chrsep/vor/pkg/mailgun"
	"github.com/chrsep/vor/pkg/minio"
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
	l := logger.New()
	defer logger.Sync(l)

	// Setup db connection
	db := postgres.Connect(
		os.Getenv("DB_USERNAME"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST")+":"+os.Getenv("DB_PORT"),
		&tls.Config{InsecureSkipVerify: true},
	)
	defer func() {
		if err := db.Close(); err != nil {
			l.Error("Failed closing db", zap.Error(err))
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
	sentryHandler := sentryhttp.New(sentryhttp.Options{Repanic: true})

	// Setup server and data stores
	server := rest.NewServer(l)
	studentStore := postgres.StudentStore{db}
	observationStore := postgres.ObservationStore{db}
	schoolStore := postgres.SchoolStore{db}
	userStore := postgres.UserStore{db}
	curriculumStore := postgres.CurriculumStore{db}
	authStore := postgres.AuthStore{db}
	classStore := postgres.ClassStore{db}
	guardianStore := postgres.GuardianStore{db}
	mailService := mailgun.NewService()
	studentImageStorage, err := minio.NewMinioImageStorage()
	if err != nil {
		l.Error("failed connecting to minio", zap.Error(err))
		return err
	}

	// Setup routing
	r := chi.NewRouter()
	r.Use(middleware.Heartbeat("/ping")) // Used by load balancer to check service health
	r.Use(middleware.RequestID)          // Add requestID for easy debugging on log
	r.Use(middleware.RealIP)             // log the real IP of user
	r.Use(middleware.Logger)             // Log stuff out for every request
	r.Use(middleware.GetHead)            // Redirect HEAD request to GET handlers
	r.Use(middleware.Recoverer)          // Catches panic, recover and return 500
	r.Use(sentryHandler.Handle)          // Panic goes to sentry first, who catch it than re-panics
	r.Mount("/auth", auth.NewRouter(server, authStore, mailService, clock.New()))
	r.Route("/api/v1", func(r chi.Router) {
		r.Use(auth.NewMiddleware(server, authStore))
		r.Mount("/students", student.NewRouter(server, studentStore))
		r.Mount("/observations", observation.NewRouter(server, observationStore))
		r.Mount("/schools", school.NewRouter(server, schoolStore, studentImageStorage))
		r.Mount("/user", user.NewRouter(server, userStore))
		r.Mount("/curriculum", curriculum.NewRouter(server, curriculumStore))
		r.Mount("/classes", class.NewRouter(server, classStore))
		r.Mount("/guardians", guardian.NewRouter(server, guardianStore))
	})
	// Serve gatsby static frontend assets
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
