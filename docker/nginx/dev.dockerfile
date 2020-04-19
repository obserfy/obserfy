FROM nginx:stable-alpine

ENV TARGET_HOST vor_app
ENV TARGET_PORT 8080

RUN /ssl/generate.sh localhost
RUN chmod 600 /ssl/localhost.crt
RUN chmod 600 /ssl/localhost.key

COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.template
RUN envsubst '\$TARGET_HOST \$TARGET_PORT' < /etc/nginx/nginx.template > /etc/nginx/nginx.conf

EXPOSE 80