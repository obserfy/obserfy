FROM node:12 AS frontend-builder
ADD . /usr/src/vor
WORKDIR /usr/src/vor/frontend
RUN yarn install --network-timeout 100000
RUN yarn build
RUN mkdir /frontend
RUN cp -r ./public /frontend/public

FROM golang:1.13 AS api-builder
ADD . /usr/src/vor
WORKDIR /usr/src/vor
RUN go build -o ./app pkg/*.go

FROM gcr.io/distroless/base
WORKDIR /usr/src/vor
COPY --from=frontend-builder /frontend ./frontend
COPY --from=api-builder /usr/src/vor/app ./app

ENV ENV=production

EXPOSE 8080
CMD ["./app"]
