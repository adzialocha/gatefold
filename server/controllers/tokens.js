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
  // @TODO: Check if this was already paid

  db('tokens')
    .where('token', req.params.token)
    .first()
    .then(token => {
      return calculateCarbonOffset(
        token.from_airport_id,
        token.to_airport_id
      )
        .then(calcuation => {
          const { emission, distance, costs, from, to } = calcuation;

          res.render('checkout', {
            name: token.name,
            token: req.params.token,
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
