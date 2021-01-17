package videos

import (
	"github.com/chrsep/vor/pkg/auth"
	"github.com/chrsep/vor/pkg/domain"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"github.com/go-pg/pg/v10"
	"github.com/google/uuid"
	"net/http"
)

func NewRouter(server rest.Server, store domain.VideoStore, videoService domain.VideoService) *chi.Mux {
	r := chi.NewRouter()

	r.Route("/{videoId}", func(r chi.Router) {
		r.Use(authMiddleware(server, store))
		r.Method("DELETE", "/", deleteVideo(server, store, videoService))
	})

	return r
}

func authMiddleware(s rest.Server, store domain.VideoStore) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
			videoId, err := uuid.Parse(chi.URLParam(r, "videoId"))
			if err != nil {
				return &rest.Error{
					Code:    http.StatusNotFound,
					Message: "Can't find the given video",
					Error:   err,
				}
			}

			// Verify user access to the school
			session, ok := auth.GetSessionFromCtx(r.Context())
			if !ok {
				return auth.NewGetSessionError()
			}
			school, err := store.GetVideoSchool(videoId)
			if err == pg.ErrNoRows {
				return &rest.Error{
					Code:    http.StatusNotFound,
					Message: "We can't find the specified video",
					Error:   err,
				}
			} else if err != nil {
				return &rest.Error{
					Code:    http.StatusInternalServerError,
					Message: "Failed to query video from db",
					Error:   err,
				}
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
				return &rest.Error{
					Code:    http.StatusUnauthorized,
					Message: "You don't have access to this school",
					Error:   err,
				}
			}

			next.ServeHTTP(w, r)
			return nil
		})
	}
}

func deleteVideo(server rest.Server, store domain.VideoStore, service domain.VideoService) http.Handler {
	return server.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		videoId, _ := uuid.Parse(chi.URLParam(r, "videoId"))

		video, err := store.GetVideo(videoId)
		if err != nil {
			return rest.NewInternalServerError(err, "failed to query video details")
		}

		if video.Status != "waiting" {
			if err := service.DeleteAsset(video.AssetId); err != nil {
				return rest.NewInternalServerError(err, "failed to delete asset")
			}
		}

		if err := store.DeleteVideo(videoId); err != nil {
			return rest.NewInternalServerError(err, "failed to delete video from db")
		}

		return nil
	})
}
