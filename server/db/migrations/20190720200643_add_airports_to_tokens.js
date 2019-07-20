exports.up = db => {
  return db.schema.table('tokens', t => {
    t.integer('from_airport_id');
    t.integer('to_airport_id');
  });
};

exports.down = db => {
  return db.schema.table('tokens', t => {
    t.dropColumn('from_airport_id');
    t.dropColumn('to_airport_id');
  });
};
