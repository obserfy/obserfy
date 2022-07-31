package main

import (
	"github.com/getsentry/sentry-go"
	sentryhttp "github.com/getsentry/sentry-go/http"
	"os"
)

func initSentry() (*sentryhttp.Handler, error) {
	options := sentry.ClientOptions{
		TracesSampleRate: 0.1,
		Dsn:              os.Getenv("SENTRY_DSN"),
		Environment:      os.Getenv("SENTRY_ENV"),
	}
	if err := sentry.Init(options); err != nil {
		return nil, err
	}

	return sentryhttp.New(sentryhttp.Options{Repanic: true}), nil
}
