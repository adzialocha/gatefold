const { NOT_FOUND } = require('http-status-codes');

const { findBySearchQuery, findById } = require('../models/airports');
const { withSuccess, withError } = require('./');

function findAirports(req, res) {
  const { query } = req.query;

  if (!query) {
    return withSuccess(res, []);
  }

  return findBySearchQuery(`%${query}%`)
    .then(result => {
      withSuccess(res, result);
    });
}

function findAirportById(req, res) {
  return findById(req.params.id)
    .then(result => {
      if (!result) {
        withError(res, NOT_FOUND);
      } else {
        withSuccess(res, result);
      }
    });
}

module.exports = {
  findAirports,
  findAirportById,
};
