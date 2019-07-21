const getAirportsData = require('airports-data');

// Fill in batch-wise as we might generate too long SQL statements otherwise
exports.seed = db => {
  return getAirportsData({ dynamic: false })
    .then(airports => {
      return db('airports').del()
        .then(() => {
          let chain = Promise.resolve();

          airports.forEach(airport => {
            const { type, iata, name, city, country, latitude, longitude } = airport;

            if (
              type === 'airport' &&
              iata &&
              name &&
              city &&
              country &&
              latitude &&
              longitude
            ) {
              chain = chain.then(() => {
                return db('airports').insert({
                  city,
                  country,
                  iata,
                  lat: latitude,
                  lon: longitude,
                  name,
                });
              });
            }
          });

          return chain;
        });
    });
};
