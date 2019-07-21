const crypto = require('crypto');

const db = require('../db');

const TOKEN_LENGTH = 64;

function generateRandomToken() {
  return crypto.randomBytes(TOKEN_LENGTH / 2).toString('hex');
}

function create(fields) {
  const { email, name, from, to } = fields;
  const token = generateRandomToken();

  return db('tokens')
    .returning(['id', 'token'])
    .insert({
      token,
      email,
      name,
      from_airport_id: from,
      to_airport_id: to,
    });
}

function findByToken(token) {
  return db('tokens')
    .where('token', token)
    .first();
}

module.exports = {
  create,
  findByToken,
};
