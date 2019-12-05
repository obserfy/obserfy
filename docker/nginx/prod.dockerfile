FROM nginx

ENV TARGET_HOST localhost
ENV TARGET_PORT 8080

COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.template
RUN envsubst < /etc/nginx/nginx.template > /etc/nginx/nginx.conf

EXPOSE 80