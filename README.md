[![Maintainability](https://api.codeclimate.com/v1/badges/b417b5c0753dab4a593e/maintainability)](https://codeclimate.com/github/chrsep/vor/maintainability)
# (WIP) Vor
A web-based tool for managing student information for Montessori Schools. Currently this tools focuses on pre-school's needs.

## Early Access MVP
Early access to the MVP is available on https://vor.chrsep.dev if you are curious to try. 

It's currently provided for free, and being tested at a single school. Keep in mind, this is a pre-alpha software. 

If you were to try, We would love to hear any of your feedback through the chat, github issue, or email at
chrsep@protonmail.com.

## Goals
1. Make it easy for teachers to observe and understand their students.
2. Speed up teacher on-boarding.
3. Reduce teacher's paperwork burden so that they can focus more on their students.

## Planned Features
- [x] Record observations
- [ ] Track student progress on Montessori curriculum
- [ ] Analyze data
- [ ] Prepare reports

## How to run
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

