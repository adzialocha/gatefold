require('dotenv').config();

const migrations = {
  tableName: 'migrations',
  directory: 'server/db/migrations',
};

const seeds = {
  directory: 'server/db/seeds',
};

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './db.sqlite3',
    },
    useNullAsDefault: true,
    migrations,
    seeds,
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations,
    seeds,
  },
};
