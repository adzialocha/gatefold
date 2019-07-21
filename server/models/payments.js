const db = require('../db');

function create(fields) {
  const { email, name, message } = fields;

  return db('payments')
    .insert({
      token_id: fields.tokenId,
      email,
      name,
      message,
      payment_success: false,
      payment_amount: fields.total,
      payment_currency: fields.currency,
      payment_id: fields.paymentId,
      payment_payer_id: null,
    });
}

function finalize(id, fields) {
  return db('payments')
    .where('id', id)
    .update({
      payment_success: true,
      payment_payer_id: fields.payerId,
    });
}

function findByPaymentId(paymentId) {
  return db('payments')
    .where('payment_id', paymentId)
    .first();
}

function findPaidByTokenId(tokenId) {
  return db('payments')
    .where('token_id', tokenId)
    .where('payment_success', true)
    .first();
}

module.exports = {
  create,
  finalize,
  findByPaymentId,
  findPaidByTokenId,
};
