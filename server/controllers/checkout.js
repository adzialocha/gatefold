const { validationResult } = require('express-validator');

const airports = require('../models/airports');
const payments = require('../models/payments');

const {
  calculateCosts,
  calculateDistance,
  calculateEmission,
} = require('../../common/carbon-calculator');

const paypal = require('../services/paypal');
const { getTokenUrl } = require('./');

function calculateCarbonOffset(token) {
  return Promise.all([
    airports.findById(token.from_airport_id),
    airports.findById(token.to_airport_id),
  ])
    .then(([from, to]) => {
      const distance = calculateDistance(from.lat, from.lon, to.lat, to.lon);
      const emission = calculateEmission(distance);
      const costs = calculateCosts(emission);

      return Promise.resolve({
        from,
        to,
        emission,
        costs,
        distance,
      });
    });
}

function showToken(req, res, extraFields = {}) {
  const { token } = req;

  return calculateCarbonOffset(token).then(offsetResult => {
    const { from, to } = offsetResult;

    const calculation = {
      emission: offsetResult.emission.toFixed(2),
      distance: offsetResult.distance.toFixed(2),
      costs: offsetResult.costs.toFixed(2),
    };

    const payment = {
      status: false,
    };

    payments.findPaidByTokenId(token.id).then(paymentResult => {
      if (paymentResult) {
        payment.status = true;
        payment.amount = paymentResult.payment_amount;
        payment.createdAt = paymentResult.created_at;
        payment.currency = paymentResult.payment_currency;
        payment.message = paymentResult.message;
        payment.name = paymentResult.name;
      }

      res.render('checkout', {
        ...extraFields,
        createdAt: token.created_at,
        name: token.name,
        token: req.params.token,
        payment,
        airports: {
          from,
          to,
        },
        calculation,
        flash: req.flash(),
      });
    });
  });
}

function createPayment(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash('error', 'Please check the missing fields below.');

    return showToken(req, res, {
      errors: errors.mapped(),
      fields: req.body,
    });
  }

  const url = getTokenUrl(req.params.token);

  // Check if this is already paid?
  payments.findPaidByTokenId(req.token.id).then(paymentResult => {
    if (paymentResult) {
      return Promise.reject(new Error('Token already paid'));
    }

    return Promise.resolve();
  }).then(() => {
    return calculateCarbonOffset(req.token);
  }).then(({ costs, emission }) => {
    const description = `Gatefold - Carbon offset ${emission} kg CO2`;

    // Prepare PayPal payment
    paypal.createPayment({
      amount: `${costs.toFixed(2)}`,
      description,
      orderUrl: url,
      returnUrl: `${url}/success`,
      cancelUrl: `${url}/cancel`,
    })
      .then(payment => {
        const { email, name, message } = req.body;

        const {
          total,
          currency,
        } = payment.transactions[0].amount;

        // Store payment already in database
        return payments.create({
          tokenId: req.token.id,
          email,
          message,
          name,
          paymentId: payment.id,
          total,
          currency,
        }).then(() => {
          res.redirect(payment.links.approval_url.href);
        });
      });
  }).catch(err => {
    console.error(err);

    req.flash('error', 'Something went wrong ...');

    return showToken(req, res, {
      fields: req.body,
    });
  });
}

function finalizePayment(req, res) {
  const paymentId = req.query.paymentId;
  const payerId = req.query.PayerID;

  // Check if PayPal parameters are given
  if (!paymentId || !payerId) {
    return res.redirect(`/tokens/${req.params.token}`);
  }

  payments.findPaidByTokenId(req.token.id).then(paymentResult => {
    // Check if token was already paid
    if (paymentResult) {
      return Promise.reject(new Error('Token already paid'));
    }

    // Check if payment exists in our database
    return payments.findByPaymentId(paymentId);
  }).then(paymentResult => {
    // Confirm payment
    return paypal.executePayment(paymentId, payerId)
      .then(() => {
        return payments.finalize(paymentResult.id, {
          payerId,
        });
      })
      .then(() => {
        req.flash('success', 'Thank you!');
        res.redirect(`/tokens/${req.params.token}`);
      });
  }).catch(err => {
    console.error(err);

    req.flash('error', 'Something went wrong ..');
    res.redirect(`/tokens/${req.params.token}`);
  });
}

function cancelPayment(req, res) {
  res.redirect(`/tokens/${req.params.token}`);
}

module.exports = {
  cancelPayment,
  createPayment,
  finalizePayment,
  showToken,
};
