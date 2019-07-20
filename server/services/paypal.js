const paypal = require('paypal-rest-sdk');

const payments = paypal.v1.payments;
const env = process.env.PAYPAL_ENV === 'live' ? 'LiveEnvironment' : 'SandboxEnvironment';

const client = new paypal.core.PayPalHttpClient(
  new paypal.core[env](
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_SECRET
  )
);

function createPayment(options) {
  const { description, amount, orderUrl, returnUrl, cancelUrl } = options;

  const payment = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    redirect_urls: {
      return_url: returnUrl,
      cancel_url: cancelUrl,
    },
    transactions: [
      {
        description,
        order_url: orderUrl,
        amount: {
          currency: process.env.PAYPAL_CURRENCY,
          total: amount,
        },
      },
    ],
  };

  const request = new payments.PaymentCreateRequest();
  request.requestBody(payment);

  return client.execute(request)
    .then(({ result }) => {
      result.links = result.links.reduce((acc, item) => {
        acc[item.rel] = {
          href: item.href,
          method: item.method,
        };

        return acc;
      }, {});

      return result;
    });
}

function executePayment(paymentId, payerId) {
  const request = new payments.PaymentExecuteRequest(paymentId);

  const paymentDetails = { payer_id: payerId };
  request.requestBody(paymentDetails);

  return client.execute(request);
}

module.exports = {
  createPayment,
  executePayment,
};
