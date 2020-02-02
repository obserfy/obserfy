package school

import (
	"errors"
	"github.com/chrsep/vor/pkg/auth"
	"github.com/chrsep/vor/pkg/postgres"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"github.com/go-pg/pg/v9"
	"net/http"
	"os"
	"time"
)

type Store interface {
	NewSchool(schoolName string, userId string) (*postgres.School, error)
	GetSchool(schoolId string) (*postgres.School, error)
	GetStudents(schoolId string) ([]postgres.Student, error)
	NewStudent(schoolId string, name string, dob *time.Time) (*postgres.Student, error)
	RefreshInviteCode(schoolId string) (*postgres.School, error)
	NewDefaultCurriculum(schoolId string) error
	DeleteCurriculum(schoolId string) error
	GetCurriculum(schoolId string) (*postgres.Curriculum, error)
	GetCurriculumAreas(schoolId string) ([]postgres.Area, error)
}

type server struct {
	rest.Server
	store Store
}

func NewRouter(s rest.Server, store Store) *chi.Mux {
	server := server{s, store}
	r := chi.NewRouter()
	r.Method("POST", "/", server.handleCreateSchool())
	r.Route("/{schoolId}", func(r chi.Router) {
		r.Use(server.authorizationMiddleware())
		r.Method("GET", "/", server.handleGetSchool())
		r.Method("GET", "/students", server.handleGetStudents())
		r.Method("POST", "/students", server.handleCreateStudent())
		r.Method("POST", "/invite-code", server.handleRefreshInviteCode())

		// TODO: This might fit better in curriculum package, revisit later
		r.Method("POST", "/curriculum", server.handleCreateNewCurriculum())
		r.Method("DELETE", "/curriculum", server.deleteCurriculum())
		r.Method("GET", "/curriculum", server.getCurriculum())
		r.Method("GET", "/curriculum/areas", server.getCurriculumAreas())
	})
	return r
}

func (s *server) handleCreateSchool() rest.Handler {
	var requestBody struct {
		Name string
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		session, ok := auth.GetSessionFromCtx(r.Context())
		if !ok {
			return auth.NewGetSessionError()
		}
		if err := rest.ParseJson(r.Body, &requestBody); err != nil {
			return rest.NewParseJsonError(err)
		}

		school, err := s.store.NewSchool(requestBody.Name, session.UserId)
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "failed saving school data", err}
		}
		w.WriteHeader(http.StatusCreated)
		if err := rest.WriteJson(w, school); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func (s *server) authorizationMiddleware() func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
			schoolId := chi.URLParam(r, "schoolId")

			// Verify user access to the school
			session, ok := auth.GetSessionFromCtx(r.Context())
			if !ok {
				return auth.NewGetSessionError()
			}
			school, err := s.store.GetSchool(schoolId)
			if err == pg.ErrNoRows {
				return &rest.Error{http.StatusNotFound, "We can't find the specified school", err}
			} else if err != nil {
				return &rest.Error{http.StatusInternalServerError, "Failed getting school", err}
			}

			// Check if user is related to the school
			userHasAccess := false
			for _, user := range school.Users {
				if user.Id == session.UserId {
					userHasAccess = true
					break
				}
			}
			if !userHasAccess {
				return &rest.Error{http.StatusUnauthorized, "You don't have access to this school", err}
			}

			next.ServeHTTP(w, r)
			return nil
		})
	}
}

func (s *server) handleGetSchool() rest.Handler {
	type responseUserField struct {
		Id            string `json:"id"`
		Name          string `json:"name"`
		Email         string `json:"email"`
		IsCurrentUser bool   `json:"isCurrentUser"`
	}

	type response struct {
		Name       string              `json:"name"`
		InviteLink string              `json:"inviteLink"`
		InviteCode string              `json:"inviteCode"`
		Users      []responseUserField `json:"users"`
	}

	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		schoolId := chi.URLParam(r, "schoolId")
		session, ok := auth.GetSessionFromCtx(r.Context())
		if !ok {
			return auth.NewGetSessionError()
		}

		// Get school data
		school, err := s.store.GetSchool(schoolId)
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed getting school data", err}
		}

		users := make([]responseUserField, len(school.Users))
		for i, user := range school.Users {
			users[i].Id = user.Id
			users[i].Email = user.Email
			users[i].Name = user.Name
			users[i].IsCurrentUser = user.Id == session.UserId
		}
		response := response{
			Name:       school.Name,
			InviteLink: "https://" + os.Getenv("SITE_URL") + "/register?inviteCode=" + school.InviteCode,
			InviteCode: school.InviteCode,
			Users:      users,
		}

		if err := rest.WriteJson(w, response); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed writing message", err}
		}
		return nil
	})
}

func (s *server) handleGetStudents() rest.Handler {
	type responseBody struct {
		Id          string     `json:"id"`
		Name        string     `json:"name"`
		DateOfBirth *time.Time `json:"dateOfBirth,omitempty"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		schoolId := chi.URLParam(r, "schoolId")

		students, err := s.store.GetStudents(schoolId)
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed getting all students", err}
		}

		response := make([]responseBody, 0)
		for _, student := range students {
			response = append(response, responseBody{
				Id:          student.Id,
				Name:        student.Name,
				DateOfBirth: student.DateOfBirth,
			})
		}
		if err = rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func (s *server) handleCreateStudent() rest.Handler {
	var requestBody struct {
		Name        string     `json:"name"`
		DateOfBirth *time.Time `json:"dateOfBirth,omitempty"`
	}
	type responseBody struct {
		Id          string     `json:"id"`
		Name        string     `json:"name"`
		DateOfBirth *time.Time `json:"dateOfBirth,omitempty"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		schoolId := chi.URLParam(r, "schoolId")
		if err := rest.ParseJson(r.Body, &requestBody); err != nil {
			return rest.NewParseJsonError(err)
		}

		student, err := s.store.NewStudent(schoolId, requestBody.Name, requestBody.DateOfBirth)
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed saving new student", err}
		}

		response := responseBody{
			Id:          student.Id,
			Name:        student.Name,
			DateOfBirth: student.DateOfBirth,
		}
		w.WriteHeader(http.StatusCreated)
		if err := rest.WriteJson(w, response); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed writing result", err}
		}
		return nil
	})
}

func (s *server) handleRefreshInviteCode() http.Handler {
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		schoolId := chi.URLParam(r, "schoolId")

		// Get related school details
		school, err := s.store.RefreshInviteCode(schoolId)
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed getting school info", err}
		}

		if err := rest.WriteJson(w, school); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func (s *server) handleCreateNewCurriculum() http.Handler {
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		// Get school id
		schoolId := chi.URLParam(r, "schoolId")

		// Return conflict error if school already has curriculum
		school, err := s.store.GetSchool(schoolId)
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed to get school data", err}
		}
		if school.CurriculumId != "" {
			return &rest.Error{http.StatusConflict, "School already have curriculum", errors.New("curriculum conflict")}
		}

		// Save default curriculum using transaction
		if err := s.store.NewDefaultCurriculum(schoolId); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed saving newly created curriculum", err}
		}

		// Return result
		w.WriteHeader(http.StatusCreated)
		return nil
	})
}

func (s *server) deleteCurriculum() rest.Handler {
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		// Get school id
		schoolId := chi.URLParam(r, "schoolId")

		// Get school data and check if curriculum exists
		err := s.store.DeleteCurriculum(schoolId)
		if errors.Is(postgres.EmptyCurriculumError{}, err) {
			return &rest.Error{http.StatusNotFound, "School doesn't have curriculum yet", err}
		} else if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed to get school data", err}
		}

		return nil
	})
}

func (s *server) getCurriculum() rest.Handler {
	type responseBody struct {
		Id   string `json:"id"`
		Name string `json:"name"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		// Get school id
		schoolId := chi.URLParam(r, "schoolId")

		// Get school data and check if curriculum exists
		c, err := s.store.GetCurriculum(schoolId)
		if errors.Is(postgres.EmptyCurriculumError{}, err) {
			return &rest.Error{http.StatusNotFound, "School doesn't have curriculum yet", err}
		} else if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed to get school data", err}
		}

		// Format queried result into response format.
		response := responseBody{c.Id, c.Name}
		if err = rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func (s *server) getCurriculumAreas() rest.Handler {
	type simplifiedArea struct {
		Id   string `json:"id"`
		Name string `json:"name"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		// Get school id
		schoolId := chi.URLParam(r, "schoolId")

		// Get school data and check if curriculum exists
		areas, err := s.store.GetCurriculumAreas(schoolId)
		if errors.Is(postgres.EmptyCurriculumError{}, err) {
			emptyArray := make([]postgres.Area, 0)
			if err = rest.WriteJson(w, emptyArray); err != nil {
				return rest.NewWriteJsonError(err)
			}
			return nil
		}
		if err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed to get school data", err}
		}

		// Format queried result into response format.
		var response []simplifiedArea
		for _, area := range areas {
			response = append(response, simplifiedArea{
				Id:   area.Id,
				Name: area.Name,
			})
		}

		if err := rest.WriteJson(w, response); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed to write json response", err}
		}
		return nil
	})
}
