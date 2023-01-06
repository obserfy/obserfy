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
  <a href="https://codecov.io/gh/obserfy/obserfy">
    <img src="https://codecov.io/gh/obserfy/obserfy/branch/develop/graph/badge.svg" alt="Code Coverage" />
  </a>

  <a href="https://github.com/obserfy/obserfy/actions/workflows/build-and-test.yml">
    <img src="https://github.com/obserfy/obserfy/actions/workflows/build-and-test.yml/badge.svg" />
  </a>
</p>

This is the monorepo of [Obserfy](https://obserfy.com). Obserfy is currently still on its early days, so things might
break and change a lot between versions and require some manual migrations. We currently don't have the
bandwidth to support independent installation, so for now, we would recommend using our hosted version
on [obserfy.com](https://obserfy.com) instead of running obserfy on your own.

If you were to give it a try, we would love to hear any of your
feedback through GitHub issue, email at [support@obserfy.com](mailto:support@obserfy.com),
or [canny](https://feedback.obserfy.com).

## Codebase

### Folder structure

```sh
packages/*        # Contains various patched or custom libraries that we use
docker/*          # Contains dockerfile  for every projects. 
apps/
|--gaia           # Contains all api and frontend for our parent's dashboard, powered by nextjs
|--vor            # Contains all code for teacher's dashboard, powered by gatsby and go
```

See each folder's README.md files for more info about them.
