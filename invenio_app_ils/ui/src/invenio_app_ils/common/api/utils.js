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

export const schemaToPidType = schema => {
  if (schema.includes('documents/document')) {
    return 'docid';
  } else if (schema.includes('eitems/eitem')) {
    return 'eitmid';
  } else if (schema.includes('internal_locations/internal_location')) {
    return 'ilocid';
  } else if (schema.includes('items/item')) {
    return 'pitmid';
  } else if (schema.includes('keywords/keyword')) {
    return 'keyid';
  } else if (schema.includes('loans/loan')) {
    return 'loanid';
  } else if (schema.includes('locations/location')) {
    return 'locid';
  } else if (schema.includes('patrons/patron')) {
    return 'patid';
  } else if (schema.includes('series/series')) {
    return 'serid';
  } else {
    throw new Error(`Failed to get pid type for schema: ${schema}`);
  }
};
