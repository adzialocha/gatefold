exports.up = db => {
  return db.schema.createTable('tokens', t => {
    t.increments('id').primary();
    t.timestamps(false, true);
    t.string('token', 64).unique();
    t.string('name', 255);
    t.string('email', 255);
  });
};

exports.down = db => {
  return db.schema.dropTable('tokens');
};
