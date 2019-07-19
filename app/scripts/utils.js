export function debounce(cb, wait) {
  let timeout;
  const context = this;

  return function() {
    const args = arguments;

    window.clearTimeout(timeout);

    timeout = window.setTimeout(() => {
      cb.apply(context, args);
    }, wait);
  };
}

export function encode(str) {
  return encodeURIComponent(str);
}

export function parameterize(obj) {
  if (Object.keys(obj).length === 0) {
    return '';
  }

  return '?' + Object.keys(obj).map(key => {
    if (Array.isArray(obj[key])) {
      return obj[key].map(item => {
        return `${encode(key)}[]=${encode(item)}`;
      }).join('&');
    }

    return `${encode(key)}=${encode(obj[key])}`;
  }).join('&');
}
