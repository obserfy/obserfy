####################################
# Build the gatsby powered frontend
####################################
FROM node:12 AS frontend-builder
WORKDIR /usr/src/vor/frontend
# Get dependencies first, so it can be cached independently
COPY ./frontend/package.json /usr/src/vor/frontend/package.json
COPY ./frontend/yarn.lock /usr/src/vor/frontend/yarn.lock
COPY ./frontend/*.tgz /usr/src/vor/frontend/
RUN yarn install --production --network-timeout 100000
# Build the project
ADD ./frontend /usr/src/vor/frontend
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
ADD . /usr/src/vor
RUN go build -o ./app pkg/*.go

####################################
# Build the final image
####################################
FROM gcr.io/distroless/base
WORKDIR /usr/src/vor
COPY --from=frontend-builder /frontend ./frontend
COPY --from=api-builder /usr/src/vor/app ./app

ENV ENV=production

EXPOSE 8080
CMD ["./app"]
