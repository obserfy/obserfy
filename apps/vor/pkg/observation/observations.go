package observation

import (
	"github.com/chrsep/vor/pkg/domain"
	"github.com/chrsep/vor/pkg/imgproxy"
	"github.com/google/uuid"
	richErrors "github.com/pkg/errors"
	"mime/multipart"
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-playground/validator/v10"

	"github.com/chrsep/vor/pkg/auth"
	"github.com/chrsep/vor/pkg/rest"
)

type Store interface {
	UpdateObservation(observationId string,
		shortDesc *string,
		longDesc *string,
		eventTime *time.Time,
		areaId uuid.UUID,
		categoryId uuid.UUID,
	) (*domain.Observation, error)
	DeleteObservation(observationId string) error
	GetObservation(id string) (*domain.Observation, error)
	CheckPermissions(observationId string, userId string) (bool, error)
	CreateImage(id string, file multipart.File, header *multipart.FileHeader) (*domain.Image, error)
}

func NewRouter(s rest.Server, store Store) *chi.Mux {
	r := chi.NewRouter()
	r.Route("/{observationId}", func(r chi.Router) {
		r.Use(authorizationMiddleware(s, store))
		r.Method("DELETE", "/", deleteObservation(s, store))
		r.Method("GET", "/", getObservation(s, store))
		r.Method("PATCH", "/", patchObservation(s, store))

		r.Method("POST", "/images", postNewImage(s, store))
	})

	return r
}
func authorizationMiddleware(s rest.Server, store Store) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
			observationId := chi.URLParam(r, "observationId")

			// Verify user access to the school
			session, ok := auth.GetSessionFromCtx(r.Context())
			if !ok {
				return auth.NewGetSessionError()
			}
			userHasAccess, err := store.CheckPermissions(observationId, session.UserId)
			if err != nil {
				return &rest.Error{http.StatusInternalServerError, "Internal Server Error", err}

			}
			// Check if user is related to the school
			if !userHasAccess {
				return &rest.Error{http.StatusNotFound, "Observation not found", err}
			}

			next.ServeHTTP(w, r)
			return nil
		})
	}
}

func deleteObservation(s rest.Server, store Store) rest.Handler {
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		id := chi.URLParam(r, "observationId")
		if err := store.DeleteObservation(id); err != nil {
			return &rest.Error{http.StatusInternalServerError, "Failed deleting observation", err}
		}
		return nil
	})
}

func getObservation(s rest.Server, store Store) http.Handler {
	type area struct {
		Id   uuid.UUID `json:"id"`
		Name string    `json:"name"`
	}
	type image struct {
		Id           uuid.UUID `json:"id"`
		ThumbnailUrl string    `json:"thumbnailUrl"`
		OriginalUrl  string    `json:"originalUrl"`
	}
	type responseBody struct {
		Id          string    `json:"id"`
		StudentName string    `json:"studentName"`
		CategoryId  string    `json:"categoryId"`
		CreatorId   string    `json:"creatorId,omitempty"`
		CreatorName string    `json:"creatorName,omitempty"`
		LongDesc    string    `json:"longDesc"`
		ShortDesc   string    `json:"shortDesc"`
		CreatedDate time.Time `json:"createdDate"`
		EventTime   time.Time `json:"eventTime,omitempty"`
		Area        *area     `json:"area"`
		Images      []image   `json:"images"`
	}
	validate := validator.New()
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		observationId := chi.URLParam(r, "observationId")
		err := validate.Var(observationId, "uuid")
		if err != nil {
			return &rest.Error{
				http.StatusNotFound,
				"Can't find the observation with the given ID",
				err,
			}
		}

		observation, err := store.GetObservation(observationId)
		if err != nil {
			return &rest.Error{
				http.StatusInternalServerError,
				"Failed getting observation",
				err,
			}
		}
		if observation == nil {
			return &rest.Error{
				http.StatusNotFound,
				"Can't find the observation with the given ID",
				err,
			}
		}

		response := responseBody{
			Id:          observation.Id,
			StudentName: observation.StudentName,
			CategoryId:  observation.CategoryId,
			LongDesc:    observation.LongDesc,
			ShortDesc:   observation.ShortDesc,
			EventTime:   observation.EventTime,
			CreatedDate: observation.CreatedDate,
		}
		if observation.CreatorId != "" {
			response.CreatorId = observation.CreatorId
			response.CreatorName = observation.CreatorName
		}
		if observation.Area.Id != "" {
			response.Area = &area{
				Id:   uuid.MustParse(observation.Area.Id),
				Name: observation.Area.Name,
			}
		}
		for i := range observation.Images {
			item := observation.Images[i]
			response.Images = append(response.Images, image{
				Id:           item.Id,
				ThumbnailUrl: imgproxy.GenerateUrl(observation.Images[i].ObjectKey, 80, 80),
				OriginalUrl:  imgproxy.GenerateOriginalUrl(observation.Images[i].ObjectKey),
			})
		}
		if err := rest.WriteJson(w, response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func patchObservation(s rest.Server, store Store) rest.Handler {
	type requestBody struct {
		LongDesc   *string    `json:"longDesc"`
		ShortDesc  *string    `json:"shortDesc"`
		EventTime  *time.Time `json:"eventTime,omitempty"`
		AreaId     uuid.UUID  `json:"areaId"`
		CategoryId uuid.UUID  `json:"categoryId"`
	}

	type area struct {
		Id   uuid.UUID `json:"id"`
		Name string    `json:"name"`
	}
	type image struct {
		Id           uuid.UUID `json:"id"`
		ThumbnailUrl string    `json:"thumbnailUrl"`
		OriginalUrl  string    `json:"originalUrl"`
	}
	type responseBody struct {
		Id          string    `json:"id"`
		ShortDesc   string    `json:"shortDesc"`
		LongDesc    string    `json:"longDesc"`
		CreatedDate time.Time `json:"createdDate"`
		EventTime   time.Time `json:"eventTime"`
		Images      []image   `json:"images"`
		Area        *area     `json:"area,omitempty"`
		CreatorId   string    `json:"creatorId,omitempty"`
		CreatorName string    `json:"creatorName,omitempty"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		observationId := chi.URLParam(r, "observationId")

		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}

		observation, err := store.UpdateObservation(
			observationId,
			body.ShortDesc,
			body.LongDesc,
			body.EventTime,
			body.AreaId,
			body.CategoryId,
		)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "failed to patch observation",
				Error:   err,
			}
		}

		response := responseBody{
			Id:          observation.Id,
			ShortDesc:   observation.ShortDesc,
			LongDesc:    observation.LongDesc,
			CreatedDate: observation.CreatedDate,
			EventTime:   observation.EventTime,
			CreatorId:   observation.CreatorId,
			CreatorName: observation.CreatorName,
		}
		if observation.Area.Id != "" {
			response.Area = &area{
				Id:   uuid.MustParse(observation.Area.Id),
				Name: observation.Area.Name,
			}
		}
		for i := range observation.Images {
			item := observation.Images[i]
			response.Images = append(response.Images, image{
				Id:           item.Id,
				ThumbnailUrl: imgproxy.GenerateUrl(observation.Images[i].ObjectKey, 80, 80),
				OriginalUrl:  imgproxy.GenerateOriginalUrl(observation.Images[i].ObjectKey),
			})
		}
		if err := rest.WriteJson(w, &response); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}

func postNewImage(s rest.Server, store Store) rest.Handler {
	type response struct {
		Id           uuid.UUID `json:"id"`
		ThumbnailUrl string    `json:"thumbnailUrl"`
		OriginalUrl  string    `json:"originalUrl"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		observationId := chi.URLParam(r, "observationId")
		if err := r.ParseMultipartForm(10 << 20); err != nil {
			return &rest.Error{
				Code:    http.StatusBadRequest,
				Message: "failed to parse payload",
				Error:   richErrors.Wrap(err, "failed to parse response body"),
			}
		}

		file, fileHeader, err := r.FormFile("image")
		image, err := store.CreateImage(observationId, file, fileHeader)
		if err != nil {
			return &rest.Error{
				Code:    http.StatusInternalServerError,
				Message: "Failed create file",
				Error:   err,
			}
		}
		w.WriteHeader(http.StatusCreated)
		if err := rest.WriteJson(w, &response{
			Id:           image.Id,
			ThumbnailUrl: imgproxy.GenerateUrl(image.ObjectKey, 80, 80),
			OriginalUrl:  imgproxy.GenerateOriginalUrl(image.ObjectKey),
		}); err != nil {
			return rest.NewWriteJsonError(err)
		}
		return nil
	})
}
