export const prepareDateQuery = (field, date, date_from, date_to) => {
  if (
    (!date || typeof date !== 'string') &&
    (!date_from || typeof date_from !== 'string') &&
    (!date_to || typeof date_to !== 'string')
  ) {
    throw TypeError(
      'Date arguments invalid or missing ' +
        '-  at least one date string required'
    );
  }
  if (date) {
    return encodeURI(`${field}:${date}`);
  }
  if (date_from && date_to) {
    return encodeURI(`${field}:{${date_from} TO ${date_to}}`);
  } else if (date_from) {
    return encodeURI(`${field}:{${date_from} TO *}`);
  } else {
    return encodeURI(`${field}:{* TO ${date_to}}`);
  }
};

export const prepareSumQuery = param => {
  if (Array.isArray(param)) {
    const paramQuery = param.join(' OR ');
    return `(${paramQuery})`;
  } else {
    return param;
  }
};
