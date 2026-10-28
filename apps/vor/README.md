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

## Running locally

See [Running locally](../../README.md#running-locally) in the root README. In short, from the repo root:

```shell script
./scripts/bootstrap.sh
yarn workspace vor run develop
```

`docker compose` runs the application server with live reload (via [air](https://github.com/cosmtrek/air)) and
debugging via [go-delve](https://github.com/go-delve/delve) on port `40000`. nginx serves it on
`https://localhost:8000`.

The Gatsby development server runs on `http://localhost:8001` and proxies its `/api`, `/auth` and `/webhooks`
routes to `https://localhost:8000`.
