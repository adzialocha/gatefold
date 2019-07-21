exports.up = db => {
  return db.schema.createTable('tokens', t => {
    t.increments('id').primary();
    t.timestamps(false, true);
    t.string('token', 64).unique().notNullable();
    t.string('name', 255).notNullable();
    t.string('email', 255).notNullable();
  });
};

exports.down = db => {
  return db.schema.dropTable('tokens');
};
