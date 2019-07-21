const tokens = require('../models/tokens');

function findByToken(req, res, next) {
  if (!('token' in req.params)) {
    next();
  }

  tokens.findByToken(req.params.token)
    .then(token => {
      if (!token) {
        throw new Error('Could not find resource');
      }

      req.token = token;

      next();
    })
    .catch(() => {
      res.render('404');
    });
}

module.exports = {
  findByToken,
};
