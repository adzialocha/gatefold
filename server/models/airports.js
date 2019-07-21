const db = require('../db');

function findBySearchQuery(query) {
  return db('airports')
    .where('name', 'like', query)
    .orWhere('city', 'like', query)
    .orWhere('country', 'like', query)
    .limit(5);
}

function findById(id) {
  return db('airports')
    .where('id', id)
    .first();
}

module.exports = {
  findById,
  findBySearchQuery,
};
