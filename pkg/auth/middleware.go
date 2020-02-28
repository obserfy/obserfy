package auth

import (
	"context"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	richErrors "github.com/pkg/errors"
	"net/http"
)

func NewMiddleware(s rest.Server, store postgres.AuthStore) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
			// Get session cookie
			cookie, err := r.Cookie("session")
			if err != nil {
				return &rest.Error{Code: http.StatusUnauthorized, Message: "Invalid session", Error: err}
			}

			// Get related session
			session, err := store.GetSession(cookie.Value)
			if err != nil {
				return &rest.Error{Code: http.StatusUnauthorized, Message: "Invalid session", Error: err}
			}

			// Attach session object to context for further use on other handlers
			ctx := context.WithValue(r.Context(), SessionCtxKey, session)
			next.ServeHTTP(w, r.WithContext(ctx))
			return nil
		})
	}
}

func GetSessionFromCtx(ctx context.Context) (*postgres.Session, bool) {
	session, ok := ctx.Value(SessionCtxKey).(*postgres.Session)
	return session, ok
}

func NewGetSessionError() *rest.Error {
	return &rest.Error{http.StatusUnauthorized, "Unauthorized", richErrors.New("session can't be found on context")}
}
