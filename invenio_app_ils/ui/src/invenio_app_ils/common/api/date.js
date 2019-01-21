import { DateTime } from 'luxon';

export const fromISO = stringDate => {
  return DateTime.fromISO(stringDate);
};

export const toISO = date => {
  return date.toISO();
};

export const toString = date => {
  return date.toLocaleString();
};

export const toShortDateTime = date => {
  return fromISO(date).toFormat('yyyy-MM-dd HH:mm');
};
