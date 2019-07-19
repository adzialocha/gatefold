exports.up = db => {
  return db.schema.createTable('tokens', t => {
    t.increments('id').primary();
    t.string('token', 255);
    t.string('name', 255);
    t.string('email', 255);
  });
};

exports.down = db => {
  return db.schema.dropTable('tokens');
};
