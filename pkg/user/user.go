package user

import (
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-pg/pg/v9"

	"github.com/chrsep/vor/pkg/auth"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/chrsep/vor/pkg/user/store"
)

var (
	userStore store.UserStore
)

type (
	UserHandler interface {
		GetUser() rest.Handler
		GetSchools() rest.Handler
	}

	server struct {
		rest.Server
		st store.UserStore
	}
)

func NewUserHandler(s rest.Server, db *pg.DB) UserHandler {
	if userStore == nil {
		userStore = store.NewUserStore(db)
	}

	return &server{s, userStore}
}

func NewRouter(handler UserHandler) *chi.Mux {
	r := chi.NewRouter()
	r.Method("GET", "/", handler.GetUser())
	r.Method("GET", "/schools", handler.GetSchools())

	return r
}

func (s *server) GetUser() rest.Handler {
	type response struct {
		Id    string `json:"id"`
		Email string `json:"email"`
		Name  string `json:"name"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		session, ok := auth.GetSessionFromCtx(r.Context())
		if !ok {
			return auth.NewGetSessionError()
		}

		user, err := s.st.GetUser(session.UserId)
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

func (s *server) GetSchools() rest.Handler {
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		session, ok := auth.GetSessionFromCtx(r.Context())
		if !ok {
			return auth.NewGetSessionError()
		}

		schools, err := s.st.GetSchools(session.UserId)
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
