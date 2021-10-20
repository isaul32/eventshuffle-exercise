# Eventshuffle backend API exercise

## Description

This repository is for the Eventshuffle backend API exercise. The solution is build by using [Nest](https://nestjs.com/) framework.

## Running the app

### Setup database

Start PostgreSQL database with Docker Compose or start PostgreSQL 14 on host and set connection details with DATABASE_URL environment variable.

```bash
$ docker-compose up -d postgres
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
$ docker-compose up -d

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
