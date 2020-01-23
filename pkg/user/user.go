package user

import (
	"context"
	"errors"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"net/http"
)

type Store interface {
	GetUser(userId string) (*postgres.User, error)
	GetSchools(userId string) ([]postgres.School, error)
}

type server struct {
	rest.Server
	store Store
}

func NewRouter(s rest.Server, store Store) *chi.Mux {
	server := server{s, store}
	r := chi.NewRouter()
	r.Method("GET", "/", server.getUser())
	r.Method("GET", "/schools", server.getSchools())
	return r
}

// TODO: This should not be here
const SessionCtxKey = "session"

func getSessionFromCtx(ctx context.Context) (postgres.Session, bool) {
	session, ok := ctx.Value(SessionCtxKey).(postgres.Session)
	return session, ok
}

func (s *server) getUser() rest.Handler {
	type response struct {
		Id    string `json:"id"`
		Email string `json:"email"`
		Name  string `json:"name"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		session, ok := getSessionFromCtx(r.Context())
		if !ok {
			return &rest.Error{http.StatusUnauthorized, "Invalid session", errors.New("can't get session from context")}
		}

		user, err := s.store.GetUser(session.UserId)
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Can't get user data", err}
		}

		if err := rest.WriteJson(w, response{
			Id:    user.Id,
			Email: user.Email,
			Name:  user.Name,
		}); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func (s *server) getSchools() rest.Handler {
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		session, ok := getSessionFromCtx(r.Context())
		if !ok {
			return &rest.Error{http.StatusUnauthorized, "Invalid session", errors.New("can't get session from context")}
		}

		schools, err := s.store.GetSchools(session.UserId)
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
