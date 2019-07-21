const { getStatusText } = require('http-status-codes');

function withSuccess(res, data) {
  return res.json({
    status: 'ok',
    data,
  });
}

function withError(res, status, error) {
  return res.status(status).json({
    status: 'error',
    error: error || getStatusText(status),
  });
}

function getTokenUrl(token) {
  return `${process.env.BASE_URL}/tokens/${token}`;
}

module.exports = {
  getTokenUrl,
  withError,
  withSuccess,
};
