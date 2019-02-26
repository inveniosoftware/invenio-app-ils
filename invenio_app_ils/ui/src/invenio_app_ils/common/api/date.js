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
