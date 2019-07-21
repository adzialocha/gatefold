const express = require('express');

const checkoutController = require('../controllers/checkout');
const tokensController = require('../controllers/tokens');

const paymentsValidation = require('../validations/payments');
const tokensValidation = require('../validations/tokens');

const tokensMiddleware = require('../middlewares/tokens');

const router = express.Router();

router
  .get(
    '/',
    tokensController.newToken
  );

router
  .post(
    '/',
    tokensValidation.create,
    tokensController.createToken
  );

router
  .get(
    '/:token',
    tokensMiddleware.findByToken,
    checkoutController.showToken
  );

router
  .put(
    '/:token',
    tokensMiddleware.findByToken,
    paymentsValidation.create,
    checkoutController.createPayment
  );

router
  .get(
    '/:token/success',
    tokensMiddleware.findByToken,
    checkoutController.finalizePayment
  );

router
  .get(
    '/:token/cancel',
    tokensMiddleware.findByToken,
    checkoutController.cancelPayment
  );

module.exports = router;
