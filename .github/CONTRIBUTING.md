# Contributing to BeatSaver Reloaded
If you wish to contribute to the codebase, feel free to fork the repository and submit a pull request. We use TSLint and Prettier to enforce a consistent coding style, so having that set up in your editor of choice is a great boon to your development process.

## Submit bug reports or feature requests
Just use the GitHub issue tracker to submit your bug reports and feature requests. When submitting, please use the [issue templates](https://github.com/lolPants/beatsaver-reloaded/issues/new/choose).

## Development Prerequisites
- Node.js (>= v10.0.0) and `yarn`
- MongoDB server running locally on port `27017`
- Redis server running locally on port `6379` **[OPTIONAL]**

## Setup
1. Fork & clone the repository, then setup a feature branch
2. Copy `.env.example` to `server/.env` and fill out the relevant keys
3. Run `yarn` in the `client` and the `server` directories to install dependencies
4. Write some code!
5. `yarn test` in the `client` / `server` directories to run Type and Lint checks
6. [Submit a pull request](https://github.com/lolPants/beatsaver-reloaded/compare)
