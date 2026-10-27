# Dev image for the vor API: Go 1.19 (same as prod/CI) with air for live reload and delve on :40000.
# Base images come from mirror.gcr.io (Google's Docker Hub cache) to avoid Docker Hub rate limits.
ARG BASE_REGISTRY=mirror.gcr.io/library
FROM ${BASE_REGISTRY}/golang:1.19

RUN go install github.com/cosmtrek/air@v1.42.0 \
 && go install github.com/go-delve/delve/cmd/dlv@v1.20.2

COPY air.toml /air.toml

WORKDIR /src/vor
EXPOSE 8080 40000
CMD ["air", "-c", "/air.toml"]
