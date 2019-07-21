exports.up = db => {
  return db.schema.createTable('airports', t => {
    t.increments('id').primary();
    t.timestamps(false, true);
    t.string('iata', 3).notNullable();
    t.string('country', 255).notNullable();
    t.string('name', 255).notNullable();
    t.string('lat', 32).notNullable();
    t.string('lon', 32).notNullable();
  });
};

exports.down = db => {
  return db.schema.dropTable('airports');
};
