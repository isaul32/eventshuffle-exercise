# Eventshuffle backend API exercise

![GitHub](https://img.shields.io/github/license/isaul32/eventshuffle-exercise)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/isaul32/eventshuffle-exercise/CI)

## Description

This repository is my submission for the [Eventshuffle backend API](Eventshuffle.md) exercise. The solution is build by using [Nest framework](https://nestjs.com/).

## Running the application

### Setup database

Start PostgreSQL database with Docker Compose or start PostgreSQL 14 on host and set connection details with DATABASE_URL environment variable.

```bash
$ docker-compose up -d postgres --build
```

### Without Docker

```bash
# use Node.js 14 LTS version
$ npm install

# development
$ npm run start

# or watch mode
$ npm run start:dev

# or debug mode
$ npm run start:debug

# or production mode
$ npm run build
$ npm run start:prod

# navigate to http://localhost:3000/
```

### With Docker

Start API backend and database services.

```bash
$ docker-compose up -d --build

# navigate to http://localhost:3000/
```

## Test

```bash
$ npm install

# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Tools

[Prisma Studio](https://www.prisma.io/studio) is a tool for exploring and manipulating database data.

```bash
npm run studio
```

[Compodoc](https://docs.nestjs.com/recipes/documentation) is a tool for generating project documentation.

```bash
npm run compodoc
```
