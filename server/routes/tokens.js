const express = require('express');
const { check } = require('express-validator');

const tokensController = require('../controllers/tokens');

const router = express.Router();

const verify = [
  check('name')
    .exists()
    .withMessage('Name is missing'),
];

router
  .get('/', tokensController.newToken);

// @TODO
// router
//   .get('/:token', tokensController.showToken);

router
  .post('/', verify, tokensController.createToken);

module.exports = router;
