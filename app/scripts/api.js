import { parameterize } from './utils';

const API_BASE_PATH = '/api/';

export default function request(path, data = {}, method = 'GET') {
  const args = {
    headers: {},
    method,
  };

  let paramsStr = '';

  if (data instanceof FormData) {
    args.body = data;
  } else if (method !== 'GET') {
    args.headers['Content-Type'] = 'application/json; charset=utf-8';
    args.body = JSON.stringify(data);
  } else if (method === 'GET') {
    paramsStr = parameterize(data);
  }

  return window.fetch(`${API_BASE_PATH}${path.join('/')}${paramsStr}`, args)
    .then(response => {
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        return response.json();
      }

      throw new TypeError(
        `Something went wrong: ${response.statusText || 'Unknown error'} (${response.status})`
      );
    })
    .then(payload => {
      if (payload.status && payload.status === 'error') {
        throw new Error(payload.message || 'Unknown error');
      }

      return payload;
    });
}
