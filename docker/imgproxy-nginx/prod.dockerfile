FROM nginx:stable-alpine

ENV TARGET_HOST imgproxy
ENV TARGET_PORT 8080

COPY ./docker/imgproxy-nginx/ssl /ssl

WORKDIR /ssl
RUN chmod 600 localhost.crt
RUN chmod 600 localhost.key

COPY ./docker/imgproxy-nginx/nginx.conf /etc/nginx/nginx.template
RUN envsubst '\$TARGET_HOST \$TARGET_PORT' < /etc/nginx/nginx.template > /etc/nginx/nginx.conf

EXPOSE 443