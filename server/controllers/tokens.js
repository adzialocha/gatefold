const { validationResult } = require('express-validator');

function newToken(req, res) {
  res.render('tokens', { flash: req.flash() });
}

function createToken(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash('error', 'Please check the missing fields below.');

    res.render('new', {
      errors: errors.mapped(),
      fields: req.body,
      flash: req.flash(),
    });

    return;
  }

  res.render('tokens', { flash: req.flash() });
}

module.exports = {
  createToken,
  newToken,
  // showToken, @TODO
};
