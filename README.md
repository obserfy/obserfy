[![Maintainability](https://api.codeclimate.com/v1/badges/b417b5c0753dab4a593e/maintainability)](https://codeclimate.com/github/chrsep/vor/maintainability)
# (WIP) Vor
## How to run
1. generate ssl certificate for postgres 
    - `cd docker/posgres/ssl`
    - `./generate.sh`
2. go back to project root and run docker compose
    - `cd ../../../`
    - `docker-compose up -d`
3. go to frontend, install dependencies and run
    - `cd frontend`
    - `yarn`
    - `yarn develop`
