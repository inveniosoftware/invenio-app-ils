import { DateTime } from 'luxon';

export const fromBackend = stringDate => {
  return DateTime.fromISO(stringDate);
};

export const toBackend = date => {
  return date.toISO();
};

export const toHuman = date => {
  return date.toLocaleString();
};
