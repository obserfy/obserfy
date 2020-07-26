package subscription

import (
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"net/http"
)

func NewRouter(server rest.Server) *chi.Mux {
	r := chi.NewRouter()
	r.Method("POST", "/", postWebhook(server))
	return r
}

func postWebhook(server rest.Server) http.Handler {
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		return nil
	})
}
