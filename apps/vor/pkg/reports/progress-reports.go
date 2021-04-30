package reports

import (
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
)

func NewRouter(s rest.Server) *chi.Mux {
	r := chi.NewRouter()
	r.Method("GET", "/{reportId}", getReport(s))

	return r
}

func getReport(server rest.Server) rest.Handler2 {
	return server.NewHandler2(func(r *rest.Request) rest.ServerResponse {

		return rest.ServerResponse{}
	})
}
