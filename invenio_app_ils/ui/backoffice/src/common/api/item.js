import { http } from './base';

const itemURL = '/items/';

const getRecord = itemPid => {
  return http.get(`${itemURL}${itemPid}`);
};

export const item = {
  url: itemURL,
  getRecord: getRecord,
};
