package mux

import (
	"github.com/chrsep/vor/pkg/rest"
	"github.com/go-chi/chi"
	"net/http"
	"time"
)

func NewWebhookRouter(server rest.Server) *chi.Mux {
	r := chi.NewRouter()
	r.Method("POST", "/", postEventWebhook(server))
	return r
}

func postEventWebhook(s rest.Server) http.Handler {
	type requestBody struct {
		Type   string `json:"type"`
		Object struct {
			Type string `json:"type"`
			ID   string `json:"id"`
		} `json:"object"`
		ID          string `json:"id"`
		Environment struct {
			Name string `json:"name"`
			ID   string `json:"id"`
		} `json:"environment"`
		Data struct {
			Tracks []struct {
				Type             string  `json:"type"`
				MaxWidth         int     `json:"max_width,omitempty"`
				MaxHeight        int     `json:"max_height,omitempty"`
				MaxFrameRate     float64 `json:"max_frame_rate,omitempty"`
				ID               string  `json:"id"`
				Duration         float64 `json:"duration"`
				MaxChannels      int     `json:"max_channels,omitempty"`
				MaxChannelLayout string  `json:"max_channel_layout,omitempty"`
			} `json:"tracks"`
			Status              string    `json:"status"`
			MaxStoredResolution string    `json:"max_stored_resolution"`
			MaxStoredFrameRate  float64   `json:"max_stored_frame_rate"`
			ID                  string    `json:"id"`
			Duration            float64   `json:"duration"`
			CreatedAt           time.Time `json:"created_at"`
			AspectRatio         string    `json:"aspect_ratio"`
		} `json:"data"`
		CreatedAt      time.Time `json:"created_at"`
		AccessorSource string    `json:"accessor_source"`
		Accessor       string    `json:"accessor"`
		RequestID      string    `json:"request_id"`
	}
	return s.NewHandler(func(w http.ResponseWriter, r *http.Request) *rest.Error {
		var body requestBody
		if err := rest.ParseJson(r.Body, &body); err != nil {
			return rest.NewParseJsonError(err)
		}
		return nil
	})
}
