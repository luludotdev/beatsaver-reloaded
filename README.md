# 🎵 BeatSaver Reloaded

[![Build Status](https://img.shields.io/travis/com/lolpants/beatsaver-reloaded.svg?style=flat-square)](https://travis-ci.com/lolPants/beatsaver-reloaded)
[![Docker Image Size](https://img.shields.io/microbadger/image-size/lolpants/beatsaver-reloaded/client-latest.svg?label=client%20image&style=flat-square)](https://hub.docker.com/r/lolpants/beatsaver-reloaded)
[![Docker Image Size](https://img.shields.io/microbadger/image-size/lolpants/beatsaver-reloaded/server-latest.svg?label=server%20image&style=flat-square)](https://hub.docker.com/r/lolpants/beatsaver-reloaded)
[![Docker Pulls](https://img.shields.io/docker/pulls/lolpants/beatsaver-reloaded.svg?style=flat-square&color=blue)](https://hub.docker.com/r/lolpants/beatsaver-reloaded)

## ⚠ Legal Notice
I do not operate BeatSaver, this repo is just the code that powers BeatSaver and *anyone* is free to use it. **Only host beatmaps with audio that you own the legal copyright to.** I am not responsible for any legal trouble you run into using this code to host beatmaps.

In addition to this, standard open-source licensing applies to this project. If you wish to use BeatSaver Reloaded for your own purposes, you must adhere to the ISC License terms, as documented in this project's [LICENSE file](https://github.com/lolPants/beatsaver-reloaded/blob/master/LICENSE).

## 🚀 Running in Production
This project uses Travis to run automated docker builds, you can find the project on [Docker Hub](https://hub.docker.com/r/lolpants/beatsaver-reloaded). A sample Docker Compose file has been provided for you to use.

It is recommended to use Redis caching and a long, random JWT token in production.

### 🛑 Prerequisites
* Docker
* Docker Compose *(optional, recommended)*
* MongoDB
* Redis

### 📝 Configuration
Configuration is done using environment variables. Please refer to `.env.example` for more information.

## 🔧 Developing
If you wish to contribute, please refer to the [contribution guidelines](https://github.com/lolPants/beatsaver-reloaded/blob/master/.github/CONTRIBUTING.md) or the [documentation](https://github.com/lolPants/beatsaver-reloaded/blob/master/docs/content/README.md).

## ℹ Documentation
Documentation is available as a vuepress site at `/docs`, or [here on GitHub](https://github.com/lolPants/beatsaver-reloaded/blob/master/docs/content/README.md).

The code that builds the site is licensed under the [project's ISC License](https://github.com/lolPants/beatsaver-reloaded/blob/master/LICENSE). However the content of the documentation is licensed using the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) license, as documented [here](https://github.com/lolPants/beatsaver-reloaded/tree/master/docs/LICENSE).
