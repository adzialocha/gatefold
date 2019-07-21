const { check } = require('express-validator');

const create = [
  check('name', 'Name is missing')
    .exists()
    .not().isEmpty(),
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

module.exports = {
  create,
};
