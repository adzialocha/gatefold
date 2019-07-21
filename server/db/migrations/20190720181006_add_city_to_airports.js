exports.up = db => {
  return db.schema.alterTable('airports', t => {
    t.string('city', 255).notNullable();
  });
};

exports.down = db => {
  return db.schema.table('airports', t => {
    t.dropColumn('city');
  });
};
