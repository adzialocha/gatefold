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

## License

GNU Affero General Public License v3.0 `AGPL-3.0`
