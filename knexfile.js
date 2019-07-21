require('dotenv').config();

const migrations = {
  tableName: 'migrations',
  directory: 'server/db/migrations',
};

const seeds = {
  directory: 'server/db/seeds',
};

module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations,
  seeds,
};
