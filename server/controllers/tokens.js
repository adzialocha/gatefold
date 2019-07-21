const { validationResult } = require('express-validator');

const tokens = require('../models/tokens');
const { getTokenUrl } = require('./');

function newToken(req, res) {
  res.render('token', { flash: req.flash() });
}

function createToken(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash('error', 'Please check the missing fields below.');

    return res.render('token', {
      errors: errors.mapped(),
      fields: req.body,
      flash: req.flash(),
    });
  }

  const { name, email, from, to } = req.body;

  tokens.create({ email, name, from, to })
    .then(([result]) => {
      const url = getTokenUrl(result.token);

      req.flash('success', `Thank you! ${url}`);
    })
    .catch(err => {
      req.flash(
        'error',
        'An internal server error occurred: ' + err
      );
    })
    .finally(() => {
      res.render('token', {
        flash: req.flash(),
      });
    });
}

module.exports = {
  createToken,
  newToken,
};
