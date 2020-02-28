# syntax=docker/dockerfile:experimental
####################################
# Build the gatsby powered frontend
####################################
FROM node:13 AS frontend-builder
WORKDIR /usr/src/vor/frontend
# Get dependencies first, so it can be cached independently
COPY ./frontend/*.tgz /usr/src/vor/frontend/
COPY ./frontend/package.json /usr/src/vor/frontend/package.json
COPY ./frontend/yarn.lock /usr/src/vor/frontend/yarn.lock
RUN yarn install --production --frozen-lockfile --network-timeout 100000
# Build the project
COPY ./.git /usr/src/vor/.git
ADD ./frontend /usr/src/vor/frontend
RUN --mount=type=secret,id=env,dst=/usr/src/vor/frontend/.env
RUN yarn build
# Move the build artifact so its easier to be copied
# on the final build
RUN mkdir /frontend
RUN cp -r ./public /frontend/public

####################################
# Build the API server
####################################
FROM golang:1.13 AS api-builder
WORKDIR /usr/src/vor
# Get dependencies first, so it can be cached independently
COPY ./go.mod /usr/src/vor/go.mod
COPY ./go.sum /usr/src/vor/go.sum
RUN go mod download
# Build the project
ADD ./pkg /usr/src/vor/mailTemplates
ADD ./pkg /usr/src/vor/pkg
RUN go build -o ./app pkg/*.go

####################################
# Build the final image
####################################
FROM gcr.io/distroless/base
WORKDIR /usr/src/vor
COPY --from=frontend-builder /frontend ./frontend
COPY --from=api-builder /usr/src/vor/app ./app
COPY --from=api-builder /usr/src/vor/mailTemplates ./mailTemplates

ENV ENV=production

EXPOSE 8080
CMD ["./app"]
