package mux

import (
	"encoding/json"
	"github.com/chrsep/vor/pkg/domain"
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
	muxgo "github.com/muxinc/mux-go"
	richErrors "github.com/pkg/errors"
	"net/http"
	"time"
)

type Store interface {
	UpdateVideo(video domain.Video) error
	DeleteVideo(id uuid.UUID) error
}

func NewWebhookRouter(server rest.Server, store Store) *chi.Mux {
	r := chi.NewRouter()
	r.Method("POST", "/", postEventWebhook(server, store))
	return r
}

func postEventWebhook(s rest.Server, store Store) http.Handler {
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

type Asset struct {
	*muxgo.Asset
	CreatedAt int64 `json:"created_at"`
}

func handleAssetDeleted(store Store, rawAsset json.RawMessage) error {
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

func handleAssetReady(store Store, rawAsset json.RawMessage, assetId string) error {
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
		Id:         id,
		Status:     "ready",
		AssetId:    assetId,
		PlaybackId: asset.PlaybackIds[0].ID,
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
