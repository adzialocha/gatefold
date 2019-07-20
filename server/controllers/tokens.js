const crypto = require('crypto');
const { validationResult } = require('express-validator');

const db = require('../db');
const { calculateCarbonOffset, getTokenUrl } = require('./');

const TOKEN_LENGTH = 64;

function generateRandomToken() {
  return crypto.randomBytes(TOKEN_LENGTH / 2).toString('hex');
}

function newToken(req, res) {
  res.render('new', { flash: req.flash() });
}

function createToken(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash('error', 'Please check the missing fields below.');

    return res.render('new', {
      errors: errors.mapped(),
      fields: req.body,
      flash: req.flash(),
    });
  }

  const token = generateRandomToken();
  const { name, email, from, to } = req.body;

  db('tokens').insert({
    token,
    email,
    name,
    from_airport_id: from,
    to_airport_id: to,
  })
    .then(() => {
      const url = getTokenUrl(token);

      req.flash('success', `Thank you! ${url}`);
    })
    .catch(err => {
      req.flash(
        'error',
        'An internal server error occurred: ' + err
      );
    })
    .finally(() => {
      res.render('new', {
        flash: req.flash(),
      });
    });
}

function showToken(req, res) {
  db('tokens')
    .leftJoin('payments', 'tokens.id', 'payments.token_id')
    .select([
      'payments.message as payment_message',
      'payments.name as payment_name',
      'payments.payment_amount as payment_amount',
      'payments.payment_currency as payment_currency',
      'payments.payment_id as payment_id',
      'tokens.from_airport_id as from_id',
      'tokens.name',
      'tokens.to_airport_id as to_id',
    ])
    .where('token', req.params.token)
    .first()
    .then(token => {
      return calculateCarbonOffset(
        token.from_id,
        token.to_id
      )
        .then(calcuation => {
          const { emission, distance, costs, from, to } = calcuation;

          res.render('checkout', {
            name: token.name,
            token: req.params.token,
            isPaid: (token.payment_id !== undefined),
            payment: {
              amount: token.payment_amount,
              currency: token.payment_currency,
              message: token.payment_message,
              name: token.payment_name,
            },
            airports: {
              from,
              to,
            },
            calculation: {
              emission: emission.toFixed(2),
              distance: distance.toFixed(2),
              costs: costs.toFixed(2),
            },
            flash: req.flash(),
          });
        });
    })
    .catch(() => {
      res.render('404');
    });
}

module.exports = {
  createToken,
  newToken,
  showToken,
};
