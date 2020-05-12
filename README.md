<p align="center">
    <img width="76px" src="./apps/vor/frontend/src/images/logo-standalone.svg" alt="Obserfy logo" />
</p>
  
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
  <a href="https://codeclimate.com/github/obserfy/obserfy/maintainability">
    <img src="https://api.codeclimate.com/v1/badges/1aba2a93623280bc298f/maintainability" />
  </a>
  <a href="https://circleci.com/gh/obserfy/obserfy">
    <img src="https://circleci.com/gh/obserfy/obserfy.svg?style=shield" alt="Current CircleCI status" />
  </a>
  <a href="https://codecov.io/gh/obserfy/obserfy">
    <img src="https://codecov.io/gh/obserfy/obserfy/branch/master/graph/badge.svg" alt="Code Coverage" />
  </a>
</p>

This is the monorepo of [Obserfy](https://obserfy.com). This repo contains every code that you need to run Obserfy on your own. Obserfy is currently still on its early days. If you were to give it a try, we would love to hear any of your feedback through github issue, or email at chrsep@protonmail.com.

## Vision

**Obserfy aims to empower teachers and schools to provide high-quality education to more children by simplifying and automating as much of their works as possible.** Our software should be fast, simple, and accessible. It should get out of the way of the teachers, allowing them to focus on understanding and planning the education of their students.


## Codebase

### Folder structure

```sh
packages/
|--design-tokens  # Contains design tokens used throughout our products, for consistency
apps/
|--e2e            # Our e2e tests
|--freyr          # Our landing page powered by gatsby
|--gaia           # Contains all api for our parent portal, powered by nextjs
|--vor            # codebase for our Web interface and APIs used by teachers, powered by gatsby and go
```

See each codebases README.md files for more info about them.
