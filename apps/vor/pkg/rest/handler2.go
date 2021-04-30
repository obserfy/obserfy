package rest

import (
	"github.com/getsentry/sentry-go"
	"github.com/go-chi/chi"
	richErrors "github.com/pkg/errors"
	"go.uber.org/zap"
	"net/http"
)

type ServerResponse struct {
	Status  int
	Body    interface{}
	Headers map[string]string
}

func (s *Server) NewHandler2(handler Handler2Func) Handler2 {
	return Handler2{s.Log, handler}
}

// Handler2 handles writing response to client.
type Handler2 struct {
	Logger  *zap.Logger
	Handler Handler2Func
}

//Handler2Func handles the incoming requests
type Handler2Func func(*Request) ServerResponse

func (h Handler2) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	res := h.Handler(&Request{r})
	if len(res.Headers) > 0 {
		writeHeaders(w, res.Headers)
	}
	if res.Status != 0 {
		w.WriteHeader(res.Status)
	}
	if res.Body != nil {
		writeBody(w, res.Body, h.Logger)
	}
}

func writeHeaders(w http.ResponseWriter, headers map[string]string) {
	header := w.Header()
	for key, value := range headers {
		header.Set(key, value)
	}
}

func writeBody(w http.ResponseWriter, body interface{}, l *zap.Logger) {
	if err := WriteJson(w, body); err != nil {
		l.Error("failed to write json", zap.Error(err))
		sentry.CaptureException(err)

		res := newErrorResponse("something went wrong")
		if err := WriteJson(w, res); err != nil {
			l.Error("failed to write error response", zap.Error(err))
			sentry.CaptureException(err)
		}
	}
}

//InternalServerError returns a new ServerResponse with 500 status and handles logging the error.
func (s *Server) InternalServerError(err error) ServerResponse {
	s.Log.Error(err.Error(), zap.Error(err))
	sentry.WithScope(func(scope *sentry.Scope) {
		scope.SetExtra("message", err.Error())
		sentry.CaptureException(err)
	})

	return ServerResponse{
		Status: http.StatusInternalServerError,
		Body:   newErrorResponse("something went wrong"),
	}
}

//BadRequest returns a new ServerResponse with 400 status and handles logging a warning.
func (s *Server) BadRequest(err error) ServerResponse {
	s.Log.Warn(err.Error(), zap.Error(err))

	return ServerResponse{
		Status: http.StatusBadRequest,
		Body:   newErrorResponse(err.Error()),
	}
}

func (s *Server) NotFound() ServerResponse {
	return ServerResponse{
		Status: http.StatusNotFound,
		Body:   newErrorResponse("given resource does not exists."),
	}
}

type Request struct {
	*http.Request
}

func (r *Request) GetParam(key string) string {
	return chi.URLParam(r.Request, key)
}

func (r *Request) ParseBody(body interface{}) error {
	if err := ParseJson(r.Body, body); err != nil {
		return richErrors.New("invalid request body")
	}
	return nil
}
