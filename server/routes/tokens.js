const express = require('express');
const { check } = require('express-validator');

const checkoutController = require('../controllers/checkout');
const tokensController = require('../controllers/tokens');

const router = express.Router();

const verifyToken = [
  check('name', 'Name is missing')
    .exists(),
  check('email', 'Email is not correct or missing')
    .exists()
    .isEmail(),
  check('from', 'Departure airport is missing')
    .exists()
    .isInt({ min: 1 }),
  check('to', 'Destination airport is missing')
    .exists()
    .isInt({ min: 1 }),
];

const verifyPayment = [
  check('name', 'Name is missing')
    .exists(),
  check('email', 'Email is not correct or missing')
    .exists()
    .isEmail(),
];

router
  .get('/', tokensController.newToken);

router
  .post('/', verifyToken, tokensController.createToken);

router
  .get('/:token', tokensController.showToken);

router
  .put('/:token', verifyPayment, checkoutController.createPayment);

router
  .get('/:token/success', checkoutController.finalizePayment);

router
  .get('/:token/cancel', checkoutController.cancelPayment);

module.exports = router;
