import { http } from './base';

const itemURL = '/items/';

const get = itemPid => {
  return http.get(`${itemURL}${itemPid}`);
};

export const item = {
  url: itemURL,
  get: get,
};
