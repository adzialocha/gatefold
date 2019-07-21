const { NOT_FOUND } = require('http-status-codes');

const airports = require('../models/airports');
const tokens = require('../models/tokens');

const { withSuccess, withError } = require('./');

const {
  calculateCosts,
  calculateDistance,
  calculateEmission,
} = require('../../common/carbon-calculator');

function getAirportsFromTokens(tokens) {
  // Find unique airport ids
  const ids = tokens.reduce((acc, token) => {
    if (!acc.includes(token.from_airport_id)) {
      acc.push(token.from_airport_id);
    }

    if (!acc.includes(token.to_airport_id)) {
      acc.push(token.to_airport_id);
    }

    return acc;
  }, []);

  // Get them from database and merge them to object
  return airports.findAllById(ids)
    .then(result => {
      return result.reduce((acc, airport) => {
        acc[airport.id] = airport;
        return acc;
      }, {});
    });
}

function findAirports(req, res) {
  const { query } = req.query;

  if (!query) {
    return withSuccess(res, []);
  }

  return airports.findBySearchQuery(`%${query}%`)
    .then(result => {
      withSuccess(res, result);
    });
}

function findAirportById(req, res) {
  return airports.findById(req.params.id)
    .then(result => {
      if (!result) {
        withError(res, NOT_FOUND);
      } else {
        withSuccess(res, result);
      }
    });
}

function findPaidTokens(req, res) {
  // @TODO: Paginate results
  return tokens.findAllPaid()
    .then(results => {
      return getAirportsFromTokens(results).then(airports => {
        return results.map(token => {
          const { id, name } = token;

          // Get regarding airport data
          const from = airports[token.from_airport_id];
          const to = airports[token.to_airport_id];

          // Calculate carbon offset
          // @TODO: Get this from database instead
          const distance = calculateDistance(from.lat, from.lon, to.lat, to.lon);
          const emission = calculateEmission(distance);
          const costs = calculateCosts(emission);

          const calculations = {
            distance: distance.toFixed(2),
            emission: emission.toFixed(2),
            costs: costs.toFixed(2),
          };

          return {
            id,
            name,
            createdAt: token.created_at,
            airports: {
              from,
              to,
            },
            calculations,
            payment: {
              paidAt: token.payment_updated_at,
              amount: token.payment_amount,
              currency: token.payment_currency,
              name: token.payment_name,
              message: token.payment_message || null,
            },
          };
        });
      });
    })
    .then(result => {
      withSuccess(res, result);
    });
}

module.exports = {
  findAirportById,
  findAirports,
  findPaidTokens,
};
