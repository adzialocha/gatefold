const { getStatusText } = require('http-status-codes');

const db = require('../db');

const {
  calculateCosts,
  calculateDistance,
  calculateEmission,
} = require('../../common/carbon-calculator');

function withSuccess(res, data) {
  return res.json({
    status: 'ok',
    data,
  });
}

function withError(res, status, error) {
  return res.status(status).json({
    status: 'error',
    error: error || getStatusText(status),
  });
}

function getTokenUrl(token) {
  return `${process.env.BASE_URL}/tokens/${token}`;
}

function getAirportById(id) {
  return db('airports')
    .where('id', id)
    .first();
}

function calculateCarbonOffset(fromId, toId) {
  return Promise.all([
    getAirportById(fromId),
    getAirportById(toId),
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

module.exports = {
  calculateCarbonOffset,
  getTokenUrl,
  withError,
  withSuccess,
};
