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

### Early Access

Early access is available now on https://obserfy.com. It is currently
provided for free but Keep in mind that the software is currently still in
early preview.

If you were to try, we would love to hear any of your feedback through github issue,
or email at chrsep@protonmail.com.

### Goals

1. Make it easy for teachers to observe, track and understand their students and plan their activities.
2. Speed up teacher on-boarding.
3. Reduce the teacher's paperwork burden so that they can focus on the more important things.

### Planned Features

- [x] Record observations
- [x] Track student progress on Montessori curriculum
- [x] Analyze data
- [ ] Prepare reports

### How to run

1. generate ssl certificate for postgres
   - `cd docker/posgres/ssl`
   - `./generate.sh`
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
