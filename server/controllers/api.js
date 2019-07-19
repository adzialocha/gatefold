const db = require('../db');

function findAirports(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.json({
      status: 'ok',
      data: [],
    });
  }

  const search = `%${query}%`;

  return db('airports')
    .where('name', 'like', search)
    .orWhere('iata', 'like', search)
    .limit(5)
    .then(data => {
      res.json({
        status: 'ok',
        data,
      });
    });
}

module.exports = {
  findAirports,
};
