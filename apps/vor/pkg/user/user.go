package user

import (
	"github.com/go-chi/chi"
	"net/http"

	"github.com/chrsep/vor/pkg/auth"
	"github.com/chrsep/vor/pkg/rest"
)

func NewRouter(s rest.Server, store Store) *chi.Mux {
	r := chi.NewRouter()
	r.Method("GET", "/", getUser(s, store))
	r.Method("GET", "/schools", getSchools(s, store))

	return r
}

func getUser(server rest.Server, store Store) rest.Handler {
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		session, ok := auth.GetSessionFromCtx(r.Context())
		if !ok {
			return auth.NewGetSessionError()
		}

		user, err := store.GetUser(session.UserId)
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Can't get user data", err}
		}

		if err := rest.WriteJson(w, user); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func getSchools(server rest.Server, store Store) rest.Handler {
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		session, ok := auth.GetSessionFromCtx(r.Context())
		if !ok {
			return auth.NewGetSessionError()
		}

		schools, err := store.GetSchools(session.UserId)
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Can't get user data", err}
		}

		// TODO: Don't return SQL objects
		if err := rest.WriteJson(w, schools); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}
