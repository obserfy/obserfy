# syntax=docker/dockerfile:experimental
# Commands are relative to the monorepo root
####################################
# Build the gatsby powered frontend
####################################
FROM node:12 AS frontend-builder
WORKDIR /usr/src
COPY . /usr/src
RUN yarn
# Build the project
RUN --mount=type=secret,id=env,dst=/usr/src/apps/vor/frontend/.env
RUN yarn workspace vor run build
# Move the build artifact so its easier to be copied
# on the final build
RUN mkdir /frontend
RUN cp -r ./apps/vor/frontend/public /frontend/public

####################################
# Build the API server
####################################
FROM golang:1.13 AS api-builder
WORKDIR /usr/src/apps/vor
COPY . /usr/src
# Build the project
RUN go build -o ./vor ./pkg/*.go

####################################
# Build the final image
####################################
FROM gcr.io/distroless/base
WORKDIR /usr/src/vor
COPY --from=frontend-builder /frontend ./frontend
COPY --from=api-builder /usr/src/apps/vor ./vor
COPY --from=api-builder /usr/src/apps/vor/mailTemplates ./mailTemplates

ENV ENV=production

EXPOSE 8080
CMD ["./vor"]
