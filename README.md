# [App] GoBarber
![CircleCI](https://img.shields.io/circleci/build/github/DiegoVictor/gobarber-app?style=flat-square&logo=circleci)
[![react-native](https://img.shields.io/badge/react--native-0.73.6-61dafb?style=flat-square&logo=react)](https://reactnative.dev/)
[![styled-components](https://img.shields.io/badge/styled_components-6.1.8-db7b86?style=flat-square&logo=styled-components)](https://styled-components.com/)
[![eslint](https://img.shields.io/badge/eslint-8.57.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![airbnb-style](https://flat.badgen.net/badge/style-guide/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![jest](https://img.shields.io/badge/jest-29.7.0-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
[![coverage](https://img.shields.io/codecov/c/gh/DiegoVictor/gobarber-app?logo=codecov&style=flat-square)](https://codecov.io/gh/DiegoVictor/gobarber-app)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://raw.githubusercontent.com/DiegoVictor/gobarber-app/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

This app version allow users to register yourself, reset or change password, email or name and to schedule appointments with providers. All the resources used by this application comes from its [`API`](https://github.com/DiegoVictor/gobarber-api).

## Table of Contents

* [Screenshots](#screenshots)
* [Installing](#installing)
  * [Configuring](#configuring)
    * [.env](#env)
    * [API](#api)
* [Usage](#usage)
  * [OS](#os)
* [Running the tests](#running-the-tests)
  * [Coverage report](#coverage-report)

# Screenshots
Click to expand.<br />
<img src="https://raw.githubusercontent.com/DiegoVictor/gobarber-app/main/screenshots/login.png" width="32%" />
<img src="https://raw.githubusercontent.com/DiegoVictor/gobarber-app/main/screenshots/register.png" width="32%" />
<img src="https://raw.githubusercontent.com/DiegoVictor/gobarber-app/main/screenshots/forgot.png" width="32%" />
<img src="https://raw.githubusercontent.com/DiegoVictor/gobarber-app/main/screenshots/profile.png" width="32%" />
<img src="https://raw.githubusercontent.com/DiegoVictor/gobarber-app/main/screenshots/dashboard.png" width="32%" />
<img src="https://raw.githubusercontent.com/DiegoVictor/gobarber-app/main/screenshots/schedule.png" width="32%" />
<img src="https://raw.githubusercontent.com/DiegoVictor/gobarber-app/main/screenshots/success.png" width="32%" />

# Installing

Easy peasy lemon squeezy:
```
$ yarn
```
Or:
```
$ npm install
```
> Was installed and configured the [`eslint`](https://eslint.org/) and [`prettier`](https://prettier.io/) to keep the code clean and patterned.

## Configuring
Configure your environment variables and remember to start the [API](https://github.com/DiegoVictor/gobarber-api) before to start this app.

### .env
In this file you may configure the API's url. Rename the `.env.example` in the root directory to `.env` then just update with your settings.

key|description|default
---|---|---
API_URL|API's url|`http://localhost:3333`

### API
Start the [`API`](https://github.com/DiegoVictor/gobarber-api) (see its README for more information). In case of any change in the API's port or host remember to update the `.env`'s `API_URL` property too.
> Also, maybe you need run reverse command to the API's port: `adb reverse tcp:3333 tcp:3333`

