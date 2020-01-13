import { invenioConfig } from '@config';

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

export const recordToPidType = record => {
  if (record.metadata.pidType) {
    return record.metadata.pidType;
  }
  return schemaToPidType(record.metadata['$schema']);
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

export const parentChildRelationPayload = (
  relationType,
  extra,
  parent,
  child
) => {
  return {
    parent_pid: parent.metadata.pid,
    parent_pid_type: recordToPidType(parent),
    child_pid: child.metadata.pid,
    child_pid_type: recordToPidType(child),
    relation_type: relationType,
    ...extra,
  };
};

export const siblingRelationPayload = (relationType, extra, second) => {
  return {
    pid: second.metadata.pid,
    pid_type: recordToPidType(second),
    relation_type: relationType,
    ...extra,
  };
};

export const formatPrice = (price, includeCurrency = true) => {
  if (!price) return null;

  const options = includeCurrency
    ? {
        style: 'currency',
        currency: price.currency,
      }
    : {
        maximumFractionDigits: 2,
      };

  return new Intl.NumberFormat(invenioConfig.i18n.priceLocale, options).format(
    price.value
  );
};
