package main

import (
	"fmt"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/go-pg/pg/v10"
	"io/ioutil"
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

			// returns 404 page with 404 sstatus code
			if path == "/404" {
				w.WriteHeader(http.StatusNotFound)
				fileContents, _ := ioutil.ReadFile(folder + "/404/index.html")
				_, _ = fmt.Fprint(w, string(fileContents))
				return
			}

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
				// If user already authenticated, jump to dashboard.
				token, err := r.Cookie("session")
				if token != nil {
					var session postgres.Session
					err = db.Model(&session).Where("token=?", token.Value).Select()
					if err == nil {
						http.Redirect(w, r, "/dashboard/students", http.StatusFound)
						return
					}
				}
			}

			// If trying to access root, redirect to dashboard
			if path == "/" || path == "/dashboard" || path == "/dashboard/" || path == "/dashboard/home" {
				http.Redirect(w, r, "/dashboard/students", http.StatusFound)
				return
			}

			// Remove trailing slashes
			if strings.HasSuffix(path, "/") {
				http.Redirect(w, r, strings.TrimSuffix(path, "/"), http.StatusMovedPermanently)
				return
			}

			// Workaround to prevent redirects on frontend pages
			// which are caused by gatsby always generating pages as index.html inside
			// folders, eg /observe/index.html instead of /observe.html.
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

			// Detect if we got 404
			if _, err := os.Stat(fmt.Sprintf("%s", folder) + r.RequestURI); os.IsNotExist(err) {
				// Check user session
				token, err := r.Cookie("session")
				if err != nil {
					http.Redirect(w, r, "/login", http.StatusFound)
					return
				}

				var session postgres.Session
				err = db.Model(&session).Where("token=?", token.Value).Select()
				// Redirect to login if user is not logged in
				if err != nil {
					http.Redirect(w, r, "/login", http.StatusFound)
					return
				}

				// Redirect to 404 page if user is not logged in
				http.Redirect(w, r, "/404", http.StatusFound)
			} else {
				next.ServeHTTP(w, r)
			}
		}
		return http.HandlerFunc(fn)
	}
}
