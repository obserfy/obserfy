<h1 align="center">
  Obserfy
</h1>

<p align="center">
    Record keeping and parent communication tool for Montessori based schools.
</p>

<p align="center">
  <a href="https://github.com/obserfy/vor/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-GPL3-blue.svg" alt="Obserfy is released under the GPL-3 license." />
  </a>
  <a href="https://codeclimate.com/github/obserfy/vor/maintainability">
    <img src="https://api.codeclimate.com/v1/badges/dc66ddec9ecb065464a3/maintainability" alt="Codeclimate maintainability score." />
  </a>
  <a href="https://circleci.com/gh/obserfy/vor">
    <img src="https://circleci.com/gh/obserfy/vor.svg?style=svg" alt="Current npm package version." />
  </a>
  <a href="https://codecov.io/gh/chrsep/vor">
    <img src="https://codecov.io/gh/obserfy/vor/branch/master/graph/badge.svg" alt="Downloads per month on npm." />
  </a>
</p>

This is the main repo of [Obserfy](https://obserfy.com). This repo contains every code that you need to run Obserfy on your own. Obserfy is currently still on its early days. If you were to give it a try, we would love to hear any of your feedback through github issue, or email at chrsep@protonmail.com.

### Vision

Scaling education is hard. Its an essential part of our society, but yet we are still struggling to deliver it evenly, in high-quality, on every part of the world. 

**Obserfy aims to empower teachers and schools to provide high-quality education to more children by simplifying and automating as much of their works as possible.** Our software should be fast, simple, and accessible. It should get out of the way of the teachers, allowing them to focus on understanding and planning the education of their students.

It is very hard to train enough people to provide high-quality education for everyone today, and not every type of education can be scaled through online learning. Because of this, we want focus on broadening the impact of individual teachers instead, by helping them do what they do today, better.

### Codebase

#### Technologies

- **Golang**: For handling routing and API
- **React**: For web frontend App
- **Typescript**: Typesafe Javascript for frontend
- **Postgres**: Database

#### Folder structure

```sh
vor/
|--docker           # Docker config files
    |-- nginx       # Nginx that handles https and frontend caching (optional)
    |-- postgres    # Postgres db for development only
    |-- vor         # Docker image for running Obserfy
|--frontend         # Frontend SPA built on Gatsby
|--pkg              # Routing and APIs using go
|--mailTemplates    # Templates for emails
```

#### Backend

Below are a high level overview of the big dependencies that we use for our Go powered backend:

- [**go-chi**](https://github.com/go-chi/chi): For handling routing and API
- [**go-pg**](https://github.com/go-pg/pg): ORM for postgres
- [**zap**](https://github.com/uber-go/zap): Fast logging solution
- [**pkg/errors**](https://github.com/pkg/errors): For better error handling
- [**playground/validators**](https://github.com/go-playground/validator): To validate structs
- [**testify**](https://github.com/stretchr/testify): For building test suites

#### Frontend

Currently, we are focusing on building a great web experience with PWA support. Below are the tech stack we use for our frontend:

- [**Gatsby**](https://www.gatsbyjs.org/): For building performance optimized SPA/PWA
- [**React**](https://reactjs.org/)
- [**Typescript**](https://www.typescriptlang.org/)
- [**Storybook**](https://storybook.js.org/): For easier development and react component documentations
- **Testing**
  - [**Jest**](https://jestjs.io/): For snapshot and unit tests
  - [**Cypress**](https://www.cypress.io/): For e2e test
  
  
### First time setup
#### Pre-requisite

2. go back to project root and run docker compose, this will run the API server
   - `cd ../../../`
   - `docker-compose up -d`
3. go to frontend, install dependencies and run gatsby.
   - `cd frontend`
   - `yarn`
   - `yarn develop`

Gatsby would be running on https://localhost:8001, with the /api proxied to http://localhost:8000.

You can import insomnia.json to insomnia to use Insomnia for debugging the API server running on http://localhost:8000.
The API server runs inside a docker container complete with auto-reload on file changes and delve for debugging.


### Running for development
