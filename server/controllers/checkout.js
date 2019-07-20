const { INTERNAL_SERVER_ERROR } = require('http-status-codes');

const db = require('../db');
const paypal = require('../services/paypal');

const {
  calculateCarbonOffset,
  getTokenUrl,
  withError,
} = require('./');

function createPayment(req, res) {
  const url = getTokenUrl(req.params.token);

  db('tokens')
    .where('token', req.params.token)
    .first()
    .then(token => {
      return calculateCarbonOffset(
        token.from_airport_id,
        token.to_airport_id
      );
    })
    .then(({ emission, costs }) => {
      const description = `Gatefold - Carbon offset ${emission} kg CO2`;

      paypal.createPayment({
        amount: `${costs.toFixed(2)}`,
        description,
        orderUrl: url,
        returnUrl: `${url}/success`,
        cancelUrl: `${url}/cancel`,
      })
        .then(data => {
          req.session.paymentId = data.id;

          res.redirect(data.links.approval_url.href);
        })
        .catch(err => {
          withError(res, INTERNAL_SERVER_ERROR, err);
        });
    })
    .catch(() => {
      res.render('404');
    });
}

function finalizePayment(req, res) {
  const paymentId = req.query.paymentId;
  const payerId = req.query.PayerID;

  if (
    !paymentId ||
    !payerId ||
    !req.session.paymentId ||
    paymentId !== req.session.paymentId
  ) {
    return res.render('404');
  }

  db('tokens')
    .where('token', req.params.token)
    .first()
    .then(token => {
      // @TODO: Verify if token was paid already
      paypal.executePayment(paymentId, payerId)
        .then(payment => {
          req.session.paymentId = null;

          req.flash('success', 'Thank you!');

          res.redirect(`/tokens/${req.params.token}`);
        })
        .catch(err => {
          withError(res, INTERNAL_SERVER_ERROR, err);
        });
    })
    .catch(() => {
      res.render('404');
    });
}

function cancelPayment(req, res) {
  if (!req.session.paymentId) {
    return res.render('404');
  }

  req.session.paymentId = null;

  res.redirect(`/tokens/${req.params.token}`);
}

module.exports = {
  cancelPayment,
  createPayment,
  finalizePayment,
};
