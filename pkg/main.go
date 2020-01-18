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
	"strings"
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
		r.Mount("/curriculum", createCurriculumSubroute(env))
	})
	r.Mount("/auth", createAuthSubroute(env))
	r.Group(func(r chi.Router) {
		frontendFolder := "./frontend/public"
		r.Use(createFrontendAuthMiddleware(env, frontendFolder))
		r.Get("/*", createFrontendFileServer(frontendFolder))
	})

	runServer(r, env)
}

func runServer(r *chi.Mux, env Env) {
	err := http.ListenAndServe(":8080", r)
	if err != nil {
		env.logger.Error("Failed serving router", zap.Error(err))
	}
}

func createFrontendFileServer(folder string) func(w http.ResponseWriter, r *http.Request) {
	return http.FileServer(http.Dir(folder)).ServeHTTP
}

func createFrontendAuthMiddleware(env Env, folder string) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		fn := func(w http.ResponseWriter, r *http.Request) {
			path := r.URL.Path

			// Make sure all request to path under dashboard has a valid session,
			// else redirect to login.
			if strings.HasPrefix(path, "/dashboard") || path == "/" {
				token, err := r.Cookie("session")
				if err != nil {
					http.Redirect(w, r, "/login", http.StatusFound)
					return
				}

				var session Session
				err = env.db.Model(&session).Where("token=?", token.Value).Select()
				if err != nil {
					http.Redirect(w, r, "/login", http.StatusFound)
					return
				}
			} else if strings.HasPrefix(path, "/login") || strings.HasPrefix(path, "/register") {
				// If user already authenticated, jump to dashboard home.
				token, err := r.Cookie("session")
				if token != nil {
					var session Session
					err = env.db.Model(&session).Where("token=?", token.Value).Select()
					if err == nil {
						http.Redirect(w, r, "/dashboard/home", http.StatusFound)
						return
					}
				}
			}

			// If trying to access root, redirect to dashboard home.
			if path == "/" || path == "/dashboard" || path == "/dashboard/" {
				http.Redirect(w, r, "/dashboard/home", http.StatusFound)
				return
			}

			// Remove trailing slashes
			if strings.HasSuffix(path, "/") {
				http.Redirect(w, r, strings.TrimSuffix(path, "/"), http.StatusMovedPermanently)
				return
			}

			// Workaround to prevent redirects on frontend pages
			// which are caused by gatsby always generating pages as index.html inside
			// folders, eg /home/index.html instead of /home.html.
			if !strings.HasSuffix(path, ".js") ||
				!strings.HasSuffix(path, ".css") ||
				!strings.HasSuffix(path, ".json") {
				file, err := os.Stat(folder + path)
				if err == nil {
					mode := file.Mode()
					if mode.IsDir() {
						r.URL.Path += "/"
					}
				}
			}

			next.ServeHTTP(w, r)
		}
		return http.HandlerFunc(fn)
	}
}

type HTTPError struct {
	code    int
	message string
	error   error
}

type AppHandler struct {
	env     Env
	handler func(http.ResponseWriter, *http.Request) *HTTPError
}

func (a AppHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// For centralized logging of error
	if err := a.handler(w, r); err != nil {
		if err.code >= http.StatusInternalServerError {
			// Server error
			a.env.logger.Error(err.message, zap.Error(err.error))
			res := createErrorResponse("InternalError", "Something went wrong")
			_ = writeJsonResponseOld(w, res, a.env.logger)
			w.WriteHeader(err.code)
		} else if err.code >= http.StatusBadRequest {
			// User error
			a.env.logger.Warn(err.message, zap.Error(err.error))
			res := createErrorResponse(string(err.code), "Something went wrong")
			_ = writeJsonResponseOld(w, res, a.env.logger)
			w.WriteHeader(err.code)
		}
	}
}
