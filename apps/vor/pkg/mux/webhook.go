package mux

import (
	"bytes"
	"encoding/json"
	"github.com/chrsep/vor/pkg/domain"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
	richErrors "github.com/pkg/errors"
	"io/ioutil"
	"net/http"
	"time"
)

// NewWebhookRouter setups routes that handles events from mux
func NewWebhookRouter(server rest.Server, store domain.VideoStore) *chi.Mux {
	r := chi.NewRouter()
	r.Use(verifySignatureMiddleware(server))
	r.Method("POST", "/", postEventWebhook(server, store))
	return r
}

func verifySignatureMiddleware(s rest.Server) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
			muxSignature := r.Header.Get("Mux-Signature")
			bodyBytes, err := ioutil.ReadAll(r.Body)
			if err != nil {
				return &rest.Error{
					Code:    http.StatusBadRequest,
					Message: "invalid body",
					Error:   err,
				}
			}

			// verify signature
			body := string(bodyBytes)
			if err := VerifySignature(body, muxSignature); err != nil {
				return &rest.Error{
					Code:    http.StatusUnauthorized,
					Message: "you're not authorized to access this endpoint",
					Error:   err,
				}
			}

			// restore original body
			r.Body = ioutil.NopCloser(bytes.NewBuffer(bodyBytes))
			next.ServeHTTP(w, r)
			return nil
		})
	}
}

// postEventWebhook handles various mux events
func postEventWebhook(s rest.Server, store domain.VideoStore) http.Handler {
	type requestBody struct {
		Type      string    `json:"type"`
		CreatedAt time.Time `json:"created_at"`
		Object    struct {
			Type string `json:"type"`
			ID   string `json:"id"`
		} `json:"object"`
		ID          string `json:"id"`
		Environment struct {
			Name string `json:"name"`
			ID   string `json:"id"`
		} `json:"environment"`
		Data     json.RawMessage `json:"data"`
		Attempts []struct {
			Address         string    `json:"address"`
			CreatedAt       time.Time `json:"created_at"`
			ID              string    `json:"id"`
			MaxAttempts     int       `json:"max_attempts"`
			ResponseBody    string    `json:"response_body"`
			ResponseHeaders struct {
			} `json:"response_headers"`
			ResponseStatusCode int `json:"response_status_code"`
			WebhookID          int `json:"webhook_id"`
		} `json:"attempts"`
		AccessorSource string `json:"accessor_source"`
		Accessor       string `json:"accessor"`
		RequestID      string `json:"request_id"`
	}

	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}

		if body.Type == "video.asset.ready" {
			if err := handleAssetReady(store, body.Data, body.Object.ID); err != nil {
				return rest.NewInternalServerError(err, "failed to handle asset ready")
			}
		} else if body.Type == "video.asset.deleted" {
			if err := handleAssetDeleted(store, body.Data); err != nil {
				return rest.NewInternalServerError(err, "failed to handle asset deletion")
			}
		} //else if body.Type == "video.upload.cancelled" {
		//	if err := handleUploadCancelled(store, body.Data); err != nil {
		//		return rest.NewInternalServerError(err, "failed to handle asset cancellation")
		//	}
		//}

		return nil
	})
}

// handleAssetDeleted got called when an asset on mux is deleted, either manually or using the API
func handleAssetDeleted(store domain.VideoStore, rawAsset json.RawMessage) error {
	var asset struct {
		Passthrough string `json:"passthrough"`
	}

	if err := json.Unmarshal(rawAsset, &asset); err != nil {
		return err
	}

	id, err := uuid.Parse(asset.Passthrough)
	if err != nil {
		return richErrors.Wrap(err, "invalid ID")
	}

	if err := store.DeleteVideo(id); err != nil {
		return err
	}

	return nil
}

// handleAssetReady got called when an asset is ready to be played from mux after being processed
func handleAssetReady(store domain.VideoStore, rawAsset json.RawMessage, assetId string) error {
	var asset struct {
		Passthrough string `json:"passthrough"`
		PlaybackIds []struct {
			Policy string `json:"policy"`
			ID     string `json:"id"`
		} `json:"playback_ids"`
	}
	if err := json.Unmarshal(rawAsset, &asset); err != nil {
		return richErrors.Wrap(err, "failed to unmarshal asset data")
	}

	id, err := uuid.Parse(asset.Passthrough)
	if err != nil {
		return richErrors.Wrap(err, "invalid ID")
	}
	if err := json.Unmarshal(rawAsset, &asset); err != nil {
		return err
	}

	if err := store.UpdateVideo(domain.Video{
		Id:           id,
		Status:       "ready",
		AssetId:      assetId,
		PlaybackId:   asset.PlaybackIds[0].ID,
		PlaybackUrl:  "https://stream.mux.com/" + asset.PlaybackIds[0].ID + ".m3u8",
		ThumbnailUrl: "https://image.mux.com/" + asset.PlaybackIds[0].ID + "/thumbnail.jpg",
	}); err != nil {
		return err
	}
	return nil
}

// TODO: handle upload cancellation
//func handleUploadCancelled(store Store, rawUpload json.RawMessage) error {
//	var upload muxgo.Upload
//	if err := json.Unmarshal(rawUpload, &upload); err != nil {
//		return richErrors.Wrap(err, "failed to unmarshal asset data")
//	}
//	return nil
//}

//func handleAssetCreated(store Store, rawAsset json.RawMessage) error {
//	var asset struct {
//		Passthrough string `json:"passthrough"`
//	}
//	if err := json.Unmarshal(rawAsset, &asset); err != nil {
//		return richErrors.Wrap(err, "failed to unmarshal asset data")
//	}
//
//	if err := store.DeleteVideo(asset.Passthrough); err != nil {
//		return richErrors.Wrap(err, "failed to delete the video")
//	}
//	return nil
//}
