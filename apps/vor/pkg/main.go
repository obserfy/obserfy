package main

import (
	"crypto/tls"
	"github.com/chrsep/vor/pkg/exports"
	"github.com/chrsep/vor/pkg/links"
	"github.com/chrsep/vor/pkg/mux"
	"github.com/chrsep/vor/pkg/paddle"
	"github.com/chrsep/vor/pkg/progress_report"
	"github.com/chrsep/vor/pkg/videos"
	richErrors "github.com/pkg/errors"
	"log"
	"net/http"
	"os"

	"github.com/benbjohnson/clock"
	"github.com/chrsep/vor/pkg/auth"
	"github.com/chrsep/vor/pkg/class"
	"github.com/chrsep/vor/pkg/curriculum"
	"github.com/chrsep/vor/pkg/guardian"
	"github.com/chrsep/vor/pkg/images"
	"github.com/chrsep/vor/pkg/lessonplan"
	"github.com/chrsep/vor/pkg/logger"
	"github.com/chrsep/vor/pkg/mailgun"
	"github.com/chrsep/vor/pkg/minio"
	"github.com/chrsep/vor/pkg/observation"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/chrsep/vor/pkg/school"
	"github.com/chrsep/vor/pkg/student"
	"github.com/chrsep/vor/pkg/user"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	_ "github.com/joho/godotenv/autoload"
	"go.uber.org/zap"
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
	db := postgres.Connect(os.Getenv("DB_USERNAME"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_HOST")+":"+os.Getenv("DB_PORT"), &tls.Config{InsecureSkipVerify: true}, "defaultdb")
	defer func() {
		if err := db.Close(); err != nil {
			l.Error("Failed closing db", zap.Error(err))
		}
		if r := recover(); r != nil {
			l.Error("panicked:", zap.Error(richErrors.Errorf("error: %v", r)))
		}
	}()

	// Initialize tables
	if err := db.RunInTransaction(db.Context(), postgres.InitTables); err != nil {
		l.Error("failed to init tables", zap.Error(err))
		return err
	}

	// Setup sentry
	sentryHandler, err := initSentry()
	if err != nil {
		return err
	}

	// Setup minio
	minioClient, err := minio.NewClient()
	if err != nil {
		l.Error("failed connecting to minio", zap.Error(err))

		return err
	}

	// Setup external services
	mailService := mailgun.NewService()
	minioImageStorage := minio.NewImageStorage(minioClient)
	fileStorage := minio.NewFileStorage(minioClient)
	videoService := mux.NewVideoService(l)

	// Setup server and data stores
	server := rest.NewServer(l)
	userStore := postgres.UserStore{DB: db}
	curriculumStore := postgres.CurriculumStore{DB: db}
	authStore := postgres.AuthStore{DB: db}
	classStore := postgres.ClassStore{DB: db}
	guardianStore := postgres.GuardianStore{DB: db}
	lessonPlanStore := postgres.LessonPlanStore{DB: db}
	subscriptionStore := postgres.SubscriptionStore{DB: db}
	linksStore := postgres.LinksStore{DB: db}
	schoolStore := postgres.SchoolStore{DB: db, FileStorage: fileStorage, ImageStorage: minioImageStorage}
	studentStore := postgres.StudentStore{DB: db, ImageStorage: minioImageStorage}
	imageStore := postgres.ImageStore{DB: db, ImageStorage: minioImageStorage}
	observationStore := postgres.ObservationStore{DB: db, ImageStorage: minioImageStorage}
	exportsStore := postgres.ExportsStore{DB: db}
	videoStore := postgres.VideoStore{DB: db}
	progressReportStore := postgres.ProgressReportsStore{DB: db}
	// attendanceStore:=postgres.AttendanceStore{db}

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
	r.Route("/webhooks/v1", func(r chi.Router) {
		r.Mount("/subscriptions", paddle.NewWebhookRouter(server, subscriptionStore))
		r.Mount("/mux", mux.NewWebhookRouter(server, videoStore))
	})
	r.Route("/api/v1", func(r chi.Router) {
		r.Use(auth.NewMiddleware(server, authStore))
		r.Mount("/students", student.NewRouter(server, studentStore))
		r.Mount("/observations", observation.NewRouter(server, observationStore))
		r.Mount("/schools", school.NewRouter(server, schoolStore, mailService, videoService))
		r.Mount("/users", user.NewRouter(server, userStore))
		r.Mount("/curriculums", curriculum.NewRouter(server, curriculumStore))
		r.Mount("/classes", class.NewRouter(server, classStore, lessonPlanStore))
		r.Mount("/guardians", guardian.NewRouter(server, guardianStore))
		r.Mount("/plans", lessonplan.NewRouter(server, lessonPlanStore))
		r.Mount("/images", images.NewRouter(server, imageStore))
		r.Mount("/links", links.NewRouter(server, linksStore))
		r.Mount("/exports", exports.NewRouter(server, exportsStore))
		r.Mount("/videos", videos.NewRouter(server, videoStore, videoService))
		r.Mount("/progress-reports", progress_report.NewRouter(server, progressReportStore))
	})

	// Serve gatsby static frontend assets
	r.Group(func(r chi.Router) {
		frontendFolder := "./frontend/public"
		r.Use(createFrontendAuthMiddleware(db, frontendFolder))
		r.Get("/*", createFrontendFileServer(frontendFolder))
	})

	// Run the server
	return http.ListenAndServe(":8080", r)
}
