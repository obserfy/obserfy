FROM nginx:stable-alpine

ENV TARGET_HOST gaia
ENV TARGET_PORT 3000

COPY ./docker/gaia-nginx/ssl /ssl

WORKDIR /ssl
RUN chmod 600 localhost.crt
RUN chmod 600 localhost.key

COPY ./docker/gaia-nginx/nginx.conf /etc/nginx/nginx.template
RUN envsubst '\$TARGET_HOST \$TARGET_PORT' < /etc/nginx/nginx.template > /etc/nginx/nginx.conf

EXPOSE 443