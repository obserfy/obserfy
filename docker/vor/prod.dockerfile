FROM golang:1.13

WORKDIR /usr/src/vor

COPY app .
RUN mkdir frontend
COPY frontend/public ./frontend/public

EXPOSE 8080
CMD ./app