FROM golang:1.13

WORKDIR /usr/src/vor

ENV GO111MODULE=on
ENV CGO_ENABLED=0

RUN go get github.com/go-delve/delve/cmd/dlv
RUN curl -fLo /usr/bin/air https://raw.githubusercontent.com/cosmtrek/air/master/bin/linux/air
RUN chmod +x /usr/bin/air

EXPOSE 8080 40000
CMD ["air"]
