FROM node:12 AS frontend-builder
ADD . /usr/src/vor
WORKDIR /usr/src/vor/frontend
RUN yarn
RUN yarn build

FROM golang:1.13 AS api-builder
ADD . /usr/src/vor
WORKDIR /usr/src/vor
RUN go build -o ./app pkg/*.go

FROM golang:1.13
RUN mkdir -p /usr/src/vor/frontend
WORKDIR /usr/src/vor
COPY --from=frontend-builder /usr/src/vor/frontend/public /usr/src/vor/frontend/public
COPY --from=api-builder /usr/src/vor/app /usr/src/vor/app
RUN chmod u+x app

EXPOSE 8080
CMD ./app