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

function findAllPaid() {
  return db('tokens')
    .leftJoin('payments', 'tokens.id', 'payments.token_id')
    .select([
      'payments.updated_at as payment_updated_at',
      'payments.message as payment_message',
      'payments.name as payment_name',
      'payments.payment_amount',
      'payments.payment_currency',
      'payments.payment_success',
      'tokens.id',
      'tokens.created_at',
      'tokens.name',
      'tokens.from_airport_id',
      'tokens.to_airport_id',
    ])
    .where('payment_success', true)
    .orderBy('payment_updated_at', 'desc');
}

module.exports = {
  create,
  findAllPaid,
  findByToken,
};
