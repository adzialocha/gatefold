# gatefold

Carbon offset platform for artists.

## Requirements

* NodeJS
* Postgresql database

## Setup

```
// Install all dependencies
npm i

// Copy config file and edit it afterwards
cp .env.example .env

// Initialize the database, this might take some time
npm run db:migrate && npm run db:seed

// Start the server
npm start
```

## Development

```
// Build app with webpack in development mode
npm run app:watch

// Start server with nodemon to watch for changes
npm run server:watch

// Check against style violations
npm run lint
```

## Deployment

Make sure you have the environmental variable `NPM_CONFIG_PRODUCTION` set to `false` when deploying this application via [Heroku](https://devcenter.heroku.com/articles/nodejs-support#package-installation) to make sure the app can be build successfully.

## License

GNU Affero General Public License v3.0 `AGPL-3.0`
