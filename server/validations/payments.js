const { check } = require('express-validator');

const create = [
  check('name', 'Name is missing')
    .exists()
    .not().isEmpty(),
  check('email', 'Email is not correct or missing')
    .exists()
    .isEmail(),
];

module.exports = {
  create,
};
