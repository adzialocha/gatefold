const crypto = require('crypto');
const { validationResult } = require('express-validator');

const db = require('../db');

const TOKEN_LENGTH = 64;

function generateRandomToken() {
  return crypto.randomBytes(TOKEN_LENGTH / 2).toString('hex');
}

function getShareUrl(id) {
  return `${process.env.BASE_URL}/tokens/${id}`;
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
      const url = getShareUrl(token);
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
    .where('token', req.params.token)
    .first()
    .then(data => {
      const { name } = data;

      res.render('compensate', {
        name,
        flash: req.flash(),
      });
    })
    .catch(() => {
      res.render('404');
    });
}

function compensateToken(req, res) {
  db('tokens')
    .where('token', req.params.token)
    .first()
    .then(data => {
      // @TODO
      res.render('compensate', {
        flash: req.flash(),
      });
    })
    .catch(() => {
      res.render('404');
    });
}

module.exports = {
  compensateToken,
  createToken,
  newToken,
  showToken,
};
