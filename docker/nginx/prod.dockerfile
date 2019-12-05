FROM nginx

ENV TARGET_HOST vor_app
ENV TARGET_PORT 80v80

COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.template
RUN envsubst < /etc/nginx/nginx.template > /etc/nginx/nginx.conf

EXPOSE 80