<p align="center">
    <img width="76px" src="../vor/frontend/src/images/logo-standalone.svg" alt="Obserfy logo" />
</p>

<h1 align="center">
  Obserfy | E2E
</h1>

<p align="center">
    This package contains all of the e2e test we use to validate the whole obserfy application suite, powered by cypress.
</p>

### How to use

1. Setup your `.env.local` files, this will be used by the e2e scripts to connect to postgres
1. Start up docker-compose, `docker-compose up` in project root
2. Start up gaia, `yarn workspace gaia run dev`
3. Open Cypress `yarn workspace e2e cy:open`

### Noteable Directories

#### scripts

This directory contains scripts that will be executed during the e2e test to interact with database and any other services. Used mostly for tearing down and seeding data to provide consistent test.

#### cypress/integration

This folder contains all the e2e test code.
