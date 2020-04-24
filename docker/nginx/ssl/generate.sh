#!/usr/bin/env bash

#Required
domain="$1"

#Change to your company details
country="GB"
state="Nottingham"
locality="Nottinghamshire"
organization="Jamescoyle.net"
organizationalunit="IT"
email="administrator@jamescoyle.net"

if [ -z "$1" ]
then
    echo "Argument not present."
    echo "Useage $0 [common name]"

    exit 99
fi

echo "Generating key request for $domain"

#Generate a key
openssl req -x509 -out $domain.crt -keyout $domain.key \
-newkey rsa:2048 -nodes -sha256 \
-subj "/C=$country/ST=$state/L=$locality/O=$organization/OU=$organizationalunit/CN=*.dev.localhost/emailAddress=$email"

chmod 0600 $domain.key

echo "---------------------------"
echo "-----Finished generate-----"
echo "---------------------------"
