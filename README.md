<p align="center">
    <img width="76px" src="./apps/vor/frontend/src/images/logo-standalone.svg" alt="Obserfy logo" />
</p>

<h1 align="center">
  Obserfy
</h1>

<p align="center">
    Montessori record keeping software and parent communication tool.
</p>

<p align="center">
  <a href="https://codeclimate.com/github/obserfy/obserfy/maintainability">
    <img src="https://api.codeclimate.com/v1/badges/2457c2aa1fea9cb172fb/maintainability" />
  </a>

  <a href="https://codecov.io/gh/obserfy/obserfy">
    <img src="https://codecov.io/gh/obserfy/obserfy/branch/develop/graph/badge.svg" alt="Code Coverage" />
  </a>

  <a href="https://github.com/obserfy/obserfy/actions/workflows/build-and-test.yml">
    <img src="https://github.com/obserfy/obserfy/actions/workflows/build-and-test.yml/badge.svg" />
  </a>
</p>

This is the monorepo of [Obserfy](https://obserfy.com). This repo contains every code that you need to run Obserfy on
your own. Obserfy is currently still on its early days. If you were to give it a try, we would love to hear any of your
feedback through GitHub issue, email at [support@obserfy.com](mailto:support@obserfy.com), or [canny](https://feedback.obserfy.com). 

## Codebase

### Folder structure

```sh
packages/*        # Contains various patched or custom libraries that we use
docker/*          # Contains dockerfile  for every projects. 
apps/
|--freyr          # Our landing page powered by gatsby
|--gaia           # Contains all api and frontend for our parent's dashboard, powered by nextjs
|--vor            # Contains all code for teacher's dashboard, powered by gatsby and go
```

See each folder's README.md files for more info about them.
