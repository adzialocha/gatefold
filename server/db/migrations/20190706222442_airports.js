exports.up = db => {
  return db.schema.createTable('airports', t => {
    t.increments('id').primary();
    t.timestamps(false, true);
    t.string('iata', 3);
    t.string('country', 2);
    t.string('name', 255);
    t.string('lat', 32);
    t.string('lon', 32);
  });
};

exports.down = db => {
  return db.schema.dropTable('airports');
};
