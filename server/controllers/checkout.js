const { UNPROCESSABLE_ENTITY, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const { validationResult } = require('express-validator');

const db = require('../db');
const paypal = require('../services/paypal');

const {
  calculateCarbonOffset,
  getTokenUrl,
  withError,
} = require('./');

function createPayment(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash('error', 'Please check the missing fields below.');

    return res.render('checkout', {
      errors: errors.mapped(),
      fields: req.body,
      flash: req.flash(),
    });
  }

  const url = getTokenUrl(req.params.token);

  db('tokens')
    .select([
      'payments.id as payment_id',
      'tokens.name',
      'tokens.from_airport_id as from_id',
      'tokens.to_airport_id as to_id',
    ])
    .leftJoin('payments', 'tokens.id', 'payments.token_id')
    .where('token', req.params.token)
    .first()
    .then(token => {
      // Check if this is already paid?
      if (token.payment_id) {
        return res.render('404');
      }

      // Get the costs
      return calculateCarbonOffset(
        token.from_id,
        token.to_id
      );
    })
    .then(({ emission, costs }) => {
      const description = `Gatefold - Carbon offset ${emission} kg CO2`;

      // Prepare PayPal payment
      paypal.createPayment({
        amount: `${costs.toFixed(2)}`,
        description,
        orderUrl: url,
        returnUrl: `${url}/success`,
        cancelUrl: `${url}/cancel`,
      })
        .then(data => {
          req.session.paymentId = data.id;
          req.session.payment = req.body;

          res.redirect(data.links.approval_url.href);
        })
        .catch(err => {
          console.error(err);

          withError(res, INTERNAL_SERVER_ERROR);
        });
    })
    .catch(() => {
      res.render('404');
    });
}

function finalizePayment(req, res) {
  const paymentId = req.query.paymentId;
  const payerId = req.query.PayerID;

  // Check if all needed parameters are given
  if (
    !paymentId ||
    !payerId ||
    !req.session.paymentId ||
    !req.session.payment ||
    paymentId !== req.session.paymentId
  ) {
    return res.render('404');
  }

  // Get the token
  db('tokens')
    .leftJoin('payments', 'tokens.id', 'payments.token_id')
    .select([
      'payments.id as payment_id',
      'tokens.id',
    ])
    .where('token', req.params.token)
    .first()
    .then(token => {
      // Check if token was already paid
      if (token.payment_id) {
        return withError(res, UNPROCESSABLE_ENTITY);
      }

      // Confirm payment
      paypal.executePayment(paymentId, payerId)
        .then(payment => {
          const { name, email, message } = req.session.payment;

          const { total, currency } = payment.result.transactions[0].amount;

          return db('payments').insert({
            token_id: token.id,
            email,
            name,
            message,
            payment_amount: total,
            payment_currency: currency,
            payment_id: paymentId,
            payment_payer_id: payerId,
          });
        })
        .then(() => {
          req.session.payment = null;
          req.session.paymentId = null;

          req.flash('success', 'Thank you!');

          res.redirect(`/tokens/${req.params.token}`);
        })
        .catch(err => {
          console.error(err);

          withError(res, INTERNAL_SERVER_ERROR);
        });
    })
    .catch(() => {
      res.render('404');
    });
}

function cancelPayment(req, res) {
  req.session.payment = null;
  req.session.paymentId = null;

  res.redirect(`/tokens/${req.params.token}`);
}

module.exports = {
  cancelPayment,
  createPayment,
  finalizePayment,
};
