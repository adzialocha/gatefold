const db = require('../db');

function findBySearchQuery(query) {
  return db('airports')
    .where('name', 'like', query)
    .orWhere('city', 'like', query)
    .orWhere('country', 'like', query)
    .limit(5);
}

function findAllById(ids) {
  return db('airports')
    .whereIn('id', ids);
}

function findById(id) {
  return db('airports')
    .where('id', id)
    .first();
}

module.exports = {
  findById,
  findAllById,
  findBySearchQuery,
};
