const { NOT_FOUND, getStatusText } = require('http-status-codes');

const db = require('../db');

function withSuccess(res, data) {
  return res.json({
    status: 'ok',
    data,
  });
}

function withError(res, status) {
  return res.status(status).json({
    status: 'error',
    error: getStatusText(status),
  });
}

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
    .select()
    .then(data => {
      if (!data.length) {
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
