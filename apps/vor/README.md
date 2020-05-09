<p align="center">
    <img width="76px" src="./frontend/src/images/logo-standalone.svg" alt="Obserfy logo" />
</p>
  
<h1 align="center">
    Vor
</h1>

<p align="center">
    Mission Control app for teachers. This workspace contains the source code for the main obserfy app used by teachers. 
</p>


## Codebase

### Technologies

- **Golang**: For handling routing and API
- **React**: For web frontend App
- **Typescript**: Typesafe Javascript for frontend
- **Postgres**: Database

### Folder structure

```sh
vor/
|--.docker           # Docker config files
    |-- nginx       # Nginx that handles https and frontend caching (optional)
    |-- postgres    # Postgres db for development only
    |-- vor         # Docker image for running Obserfy
|--frontend         # Frontend SPA built on Gatsby
|--mailTemplates    # Templates for emails
|--migrations       # SQL files related to migrations for various vor versions
|--pkg              # Routing and APIs using go
```

### Backend

Below are a high level overview of the big dependencies that we use for our go powered backend:

- [**go-chi**](https://github.com/go-chi/chi): For handling routing and API
- [**go-pg**](https://github.com/go-pg/pg): ORM for postgres
- [**zap**](https://github.com/uber-go/zap): Fast logging solution
- [**pkg/errors**](https://github.com/pkg/errors): For better error handling
- [**playground/validators**](https://github.com/go-playground/validator): To validate structs
- [**testify**](https://github.com/stretchr/testify): For building test suites

### Frontend

Currently, we are focusing on building a great web experience with PWA support for the client. Below are the tech stack we use for our frontend:

- [**Gatsby**](https://www.gatsbyjs.org/): For building performance optimized SPA/PWA
- [**React**](https://reactjs.org/): For the view layer
- [**Typescript**](https://www.typescriptlang.org/): For type checking
- [**Storybook**](https://storybook.js.org/): For easier development and react component documentations
- **Testing**
  - [**Jest**](https://jestjs.io/): For snapshot and unit tests
  - [**Cypress**](https://www.cypress.io/): For e2e test

## Initial setup

### Pre-requisite

To run obserfy for development, you'll need the following tools:

- **Docker**: See [the Docker documentation](https://docs.docker.com/install/) for instructions to install `docker` and `docker-compose`
- **Node:12**: Install node 12, we recommend [nvm](https://github.com/nvm-sh/nvm) to do this, so that you can have multiple node versions on you computer.
- **Yarn V1**: See [yarn's documentation](https://classic.yarnpkg.com/lang/en/) on how to install.

### Setup env

Simply copy the .env.example into .env so that it will be read by docker-compose.

```shell script
cp .env.example .env
```

## Running obserfy

### Docker compose

You'll need to run docker-compose, it will start up every backend service we need for development, such as DB, Nginx, the application server itself, etc. To run docker-compose simply run:

```shell script
docker-compose up -d
```

If you're only modifying the application server codes, this should be enough. It will run the application server code with live reload. It also will run with debugging enabled via [go-delve](https://github.com/go-delve/delve) on port `40000`. The application server will be serving on `http://localhost:8000`.

### Gatsby development server

To develop the web frontend, you'll need to start the gatsby development server. First go to the frontend folder.

```shell script
cd frontend
```

Then install its dependencies.

```shell script
yarn install
```

Then you'll be able to run gatsby's development server.

```shell script
yarn develop
```

This will start gatsby's development server on `http://localhost:8001`. It will proxy all request to its `/api` and `/auth` routes to the application server on `http://localhost:8000` automatically.
