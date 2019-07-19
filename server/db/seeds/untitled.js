const airports = require('airports');

// Fill in batch-wise as we might generate too long SQL statements otherwise
exports.seed = db => {
  return db('airports').del()
    .then(() => {
      let chain = Promise.resolve();

      airports.forEach(airport => {
        const { status, type, iata, name, lat, lon } = airport;
        if (status === 1 && type === 'airport') {
          chain = chain.then(() => {
            return db('airports').insert({
              iata,
              country: airport.iso,
              name,
              lat,
              lon,
            });
          });
        }
      });

      return chain;
    });
};
