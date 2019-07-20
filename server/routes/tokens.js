const express = require('express');
const { check } = require('express-validator');

const tokensController = require('../controllers/tokens');

const router = express.Router();

const verify = [
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

router
  .get('/', tokensController.newToken);

// @TODO
// router
//   .get('/:token', tokensController.showToken);

router
  .post('/', verify, tokensController.createToken);

module.exports = router;
