import { DateTime } from 'luxon';
import _get from 'lodash/get';
import _hasIn from 'lodash/hasIn';

/**
 * Converts datetime JSON string to luxon Datetime object
 * @param stringDate
 * @returns {DateTime}
 */
export const fromISO = stringDate => {
  return DateTime.fromISO(stringDate);
};

/**
 * Converts luxon Datetime object to ISO date string
 * @param date
 * @returns {String}
 */
export const toISO = date => {
  if (_hasIn(date, 'toISO')) {
    return date.toISO();
  }
  return date ? date : '';
};

/**
 *  Serializes date for display in short format
 *  @param {DateTime} date luxon DateTime
 *  @returns {String}
 */
export const toShortDateTime = date => {
  return date instanceof DateTime ? date.toFormat('yyyy-MM-dd HH:mm') : date;
};

/**
 *  Serializes date for display in short format
 *  @param {DateTime} date luxon DateTime
 *  @returns {String}
 */
export const toShortDate = date => {
  return date instanceof DateTime ? date.toFormat('yyyy-MM-dd') : date;
};

/**
 *  Serializes date for display in tables
 */
export function dateFormatter({ col, row }) {
  const dateField = _get(row, col.field);
  return dateField ? toShortDate(fromISO(dateField)) : null;
}
