import { DateTime } from 'luxon';

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
 * Converts datetime object to long datetime string
 * @param date
 * @returns {string}
 */
export const toString = date => {
  return date.toLocaleString();
};

/**
 *  Serializes date for display in short format
 *  @param {DateTime} date luxon DateTime
 *  @re
 */
export const toShortDateTime = date => {
  return date.toFormat('yyyy-MM-dd HH:mm');
};
