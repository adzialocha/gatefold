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

  let success;

  // @TODO: Store calculations in database
  tokens.create({ email, name, from, to })
    .then(([result]) => {
      success = getTokenUrl(result.token);
      req.flash('success', 'Thank you! Your token was created successfully!');
    })
    .catch(err => {
      req.flash(
        'error',
        'An internal server error occurred: ' + err
      );
    })
    .finally(() => {
      res.render('token', {
        success,
        flash: req.flash(),
      });
    });
}

module.exports = {
  createToken,
  newToken,
};
