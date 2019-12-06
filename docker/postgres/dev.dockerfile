FROM postgres:11.5

ADD pg_hba.conf /pg_hba.conf
ADD postgresql.conf /postgresql.conf
COPY start.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod 777 /usr/local/bin/docker-entrypoint.sh
ADD ./ssl /ssl
RUN chown postgres:postgres -R /ssl
