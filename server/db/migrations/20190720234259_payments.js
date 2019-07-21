exports.up = db => {
  return db.schema.createTable('payments', t => {
    t.increments('id').primary();
    t.timestamps(false, true);
    t.integer('token_id').unique().notNullable();
    t.string('name', 255).notNullable();
    t.string('email', 255).notNullable();
    t.text('message');
    t.string('payment_id', 128).notNullable();
    t.string('payment_payer_id', 128);
    t.float('payment_amount').notNullable();
    t.string('payment_currency', 3).notNullable();
    t.boolean('payment_success');
  });
};

exports.down = db => {
  return db.schema.dropTable('payments');
};
