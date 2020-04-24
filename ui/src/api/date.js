import { DateTime } from 'luxon';
import _get from 'lodash/get';

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
 * @param {DateTime} date luxon DateTime
 * @returns {String}
 */
export const toISO = date => {
  return date instanceof DateTime ? date.toISO() : date;
};

/**
 *  Serializes date to ISO Date
 *  @param {DateTime} date luxon DateTime
 *  @returns {String}
 */
export const toISODate = date => {
  return date.toISODate();
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
export function dateFormatter({ col, row }, defaultValue = null) {
  const dateField = _get(row, col.field);
  return dateField ? toShortDate(fromISO(dateField)) : defaultValue;
}
