package auth

import (
	"context"
	richErrors "github.com/pkg/errors"
	"net/http"

	"github.com/chrsep/vor/pkg/rest"
)

func NewMiddleware(s rest.Server, store Store) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
			// Get session cookie
			cookie, err := r.Cookie("session")
			if err != nil {
				return &rest.Error{
					Code:    http.StatusUnauthorized,
					Message: "Invalid session",
					Error:   err,
				}
			}

			// Get related session
			session, err := store.GetSession(cookie.Value)
			if err != nil {
				return &rest.Error{
					Code:    http.StatusUnauthorized,
					Message: "Invalid session",
					Error:   err,
				}
			}

			// Attach session object to context for further use on other handlers
			ctx := context.WithValue(r.Context(), SessionCtxKey, session)
			next.ServeHTTP(w, r.WithContext(ctx))
			return nil
		})
	}
}

func GetSessionFromCtx(ctx context.Context) (*Session, bool) {
	session, ok := ctx.Value(SessionCtxKey).(*Session)
	return session, ok
}

func NewGetSessionError() *rest.Error {
	return &rest.Error{http.StatusUnauthorized, "Unauthorized", richErrors.New("session can't be found on context")}
}
