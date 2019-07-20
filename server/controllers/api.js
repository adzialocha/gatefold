const { NOT_FOUND } = require('http-status-codes');

const db = require('../db');
const { withSuccess, withError } = require('./');

function findAirports(req, res) {
  const { query } = req.query;

  if (!query) {
    return withSuccess(res, []);
  }

  const search = `%${query}%`;

  return db('airports')
    .where('name', 'like', search)
    .orWhere('city', 'like', search)
    .orWhere('country', 'like', search)
    .limit(5)
    .then(data => {
      withSuccess(res, data);
    });
}

function findAirportById(req, res) {
  return db('airports')
    .where('id', req.params.id)
    .first()
    .then(data => {
      if (!data) {
        withError(res, NOT_FOUND);
      } else {
        withSuccess(res, data);
      }
    });
}

module.exports = {
  findAirports,
  findAirportById,
};
