exports.up = db => {
  return db.schema.createTable('payments', t => {
    t.increments('id').primary();
    t.integer('token_id').unique();
    t.string('name', 255);
    t.string('email', 255);
    t.text('message');
    t.string('payment_id', 128);
    t.string('payment_payer_id', 128);
    t.float('payment_amount');
    t.string('payment_currency', 3);
  });
};

exports.down = db => {
  return db.schema.dropTable('payments');
};
