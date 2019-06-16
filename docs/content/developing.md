---
title: Developing
sidebar: auto
---

# Developing for BeatSaver Reloaded

## Prerequisites
* [Node.js](https://nodejs.org/) *(v10 or later)*
* [Yarn](https://yarnpkg.com/) package manager
* [MongoDB](https://www.mongodb.com/) *(v4 or later)*
* [Redis](https://redis.io/)
* [Elasticsearch](https://www.elastic.co/) *(optional)*

## Repo Layout
The BeatSaver Reloaded repo uses a monorepo format, in that both the client and the server are in the same repository. They are located at `/client` and `/server` respectively. Unless otherwise specified, commands to be run for either the client or the server should be run in their directories.

## Data Stores
BeatSaver reloaded uses MongoDB for general data storage and Redis as an ephemeral store for ratelimiting and route caching. Both are required to be running in a development environment.

### MongoDB
MongoDB is a NoSQL data store which is used to store user and beatmap details. The default host for development is `localhost:27017`, but this can be overriden with environment variables (see [Configuration](#configuration) for more info).

If you have Docker installed, you can start a MongoDB instance locally with the following command:
```
$ docker run --name mongo -p 27017:27017 mongo
```

### Redis
Redis is an in-memory key-value store which is used to store ratelimit sessions and route caching. The default host for development is `localhost:6379`, but this can be overriden with environment variables (see [Configuration](#configuration) for more info).

::: warning
BeatSaver Reloaded uses database 0 for ratelimit sessions and database 1 for caching. This currently cannot be overriden.
:::

If you have Docker installed, you can start a Redis instance locally with the following command:
```
$ docker run --name redis -p 6379:6379 redis:alpine
```

### Elasticsearch
Elasticsearch is a search engine for text and JSON-based documents which is used to power the `/search` endpoints. The default host for development is `localhost:9200`, but this can be overriden with environment variables (see [Configuration](#configuration) for more info).

::: warning
Elasticsearch is optional for development, but if you wish to disable it, please set `ELASTIC_DISABLED=true` in your `.env` file.

Disabling Elasticsearch will return HTTP 501 on all `/search` endpoints.
:::

If you have Docker installed, you can start an Elasticsearch instance locally with the following command:
```
$ docker run --name elastic -p 9200:9200 \
  -e "discovery.type=single-node" \
  docker.elastic.co/elasticsearch/elasticsearch:7.1.1
```

## Configuration
All config for BeatSaver reloaded is done using environment variables. An example `.env` file has been provided at the root of the repo. To use this in development, copy it into the `/server` directory and rename it to `.env`.

The example `.env` file documents everything relevant that you can change. However there are some extra variables that are not meant for general use.

```env
# Override server port
# Not recommended
PORT=3000

# Change environment from dev to prod
# Can be either 'development' or 'production'
NODE_ENV=development
```

## IDE Tools
BeatSaver Reloaded uses TypeScript for type safety, and TSLint and Prettier for code style enforcement. Having these setup in your IDE of choice will be helpful for development as code is required to adhere to these styles before being merged.

To run code style checks manually:
```sh
$ yarn test
```

It is recommended to use [VSCode](https://code.visualstudio.com/) for development, but you're free to use whatever you like. If you do use VSCode, here is a list of extensions that will be useful:
* [TSLint](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin)
* [DotENV](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv)
* [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

## Server Setup
First, setup the environment variables. (see [Configuration](#configuration)). Next, install dependencies with Yarn.
```sh
$ yarn
```

Yarn scripts have been provided to run everything you need for development. To run the server you need to compile the TypeScript source, then run node. If running the compiler in watch mode you will need two terminals open to run both the compiler and node.

```sh
# Start the TypeScript compiler in watch mode
$ yarn dev

# Start node in watch mode
$ yarn dev:run
```

For a list of all the scripts available, check the server's [`package.json`](https://github.com/lolPants/beatsaver-reloaded/blob/master/server/package.json)

## Client Setup
::: warning
Developing for the client requires running the server. It uses `localhost:3000` as its base URL for API requests in development mode. Currently this cannot be changed without editing the axios configuration.
:::

First, install dependencies with Yarn.
```sh
$ yarn
```

The client uses Parcel to bundle modules which comes with a development server. You can launch this with a script. By default it runs on port `1234` but if this is in use it will pick a random port and show that in your terminal.

As with the server, yarn scripts have been provided.
```sh
$ yarn dev
```

Parcel leverages a file cache for faster build times. If you wish to clean this cache to ensure a fresh build, a script has been provided to clean the cache and the compiled assets.
```sh
$ yarn run clean
```

## Contributing your code
If you wish to contribute code, first fork the repository. It is recommended to do your work on a feature branch in your fork.

Once you have commited your code, submit a [Pull Request](https://github.com/lolPants/beatsaver-reloaded/pulls). Please fill out the template with all relevant information. Pull requests are subjected to automatic code style checks, so please ensure you adhere to the style guide. **Code that does not pass these automatic checks will not be merged.**

Code will then be reviewed manually for any bugs or errors. If any are found you will be asked to fix things. If all is well then your code will be merged into the codebase, and you can enjoy a job well done.
