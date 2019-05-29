export const prepareDateQuery = (field, date, dateFrom, dateTo) => {
  if (
    (!date || typeof date !== 'string') &&
    (!dateFrom || typeof dateFrom !== 'string') &&
    (!dateTo || typeof dateTo !== 'string')
  ) {
    throw TypeError(
      'Date arguments invalid or missing ' +
        '-  at least one date string required'
    );
  }
  if (date) {
    return encodeURI(`${field}:${date}`);
  }
  if (dateFrom && dateTo) {
    return encodeURI(`${field}:{${dateFrom} TO ${dateTo}}`);
  } else if (dateFrom) {
    return encodeURI(`${field}:{${dateFrom} TO *}`);
  } else {
    return encodeURI(`${field}:{* TO ${dateTo}}`);
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
