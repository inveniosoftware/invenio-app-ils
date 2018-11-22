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
