import { DateTime } from 'luxon';
import _get from 'lodash/get';

export const fromISO = stringDate => {
  return DateTime.fromISO(stringDate);
};

/**
 * Converts datetime JSON string to luxon Datetime object
 * @param date
 * @returns {DateTime}
 */
export const toISO = date => {
  return date.toISO();
};

/**
 *  Serializes date for display in short format
 *  @param {DateTime} date luxon DateTime
 *  @re
 */
export const toShortDateTime = date => {
  return date.toFormat('yyyy-MM-dd HH:mm');
};

/**
 *  Serializes date for display in short format
 *  @param {DateTime} date luxon DateTime
 *  @re
 */
export const toShortDate = date => {
  return date.toFormat('yyyy-MM-dd');
};

/**
 *  Serializes date for UTC date in short format used to
 *  normalise dates for REST API
 *  @param {DateTime} date luxon DateTime
 *  @re
 */
export const toUTCShortDate = date => {
  if (!(typeof date === 'string' || date instanceof DateTime)) {
    throw Error('Wrong date type provided');
  }
  if (typeof date === 'string') {
    date = fromISO(date);
  }
  return date.toUTC().toFormat('yyyy-MM-dd');
};

/**
 *  Serializes date for display in tables
 */
export function dateFormatter({ col, row }) {
  const dateField = _get(row, col.field);
  return dateField ? toShortDate(fromISO(dateField)) : null;
}
