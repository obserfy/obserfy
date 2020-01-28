package main

import (
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/go-pg/pg/v9"
	"net/http"
	"os"
	"strings"
)

func createFrontendFileServer(folder string) func(w http.ResponseWriter, r *http.Request) {
	return http.FileServer(http.Dir(folder)).ServeHTTP
}

func createFrontendAuthMiddleware(db *pg.DB, folder string) func(next http.Handler) http.Handler {
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

				var session postgres.Session
				err = db.Model(&session).Where("token=?", token.Value).Select()
				if err != nil {
					http.Redirect(w, r, "/login", http.StatusFound)
					return
				}
			} else if strings.HasPrefix(path, "/login") || strings.HasPrefix(path, "/register") {
				// If user already authenticated, jump to dashboard home.
				token, err := r.Cookie("session")
				if token != nil {
					var session postgres.Session
					err = db.Model(&session).Where("token=?", token.Value).Select()
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
