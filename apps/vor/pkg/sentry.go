package main

import (
	"github.com/getsentry/sentry-go"
	sentryhttp "github.com/getsentry/sentry-go/http"
	"os"
)

func initSentry() (*sentryhttp.Handler, error) {
	options := sentry.ClientOptions{
		Dsn:              os.Getenv("SENTRY_DSN"),
		TracesSampleRate: 0.1,
	}
	if err := sentry.Init(options); err != nil {
		return nil, err
	}

	return sentryhttp.New(sentryhttp.Options{Repanic: true}), nil
}
