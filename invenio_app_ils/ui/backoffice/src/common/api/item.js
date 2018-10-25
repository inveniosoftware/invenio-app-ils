import { http } from './base';

const itemURL = '/items/';

const getList = () => {
  return http.get(itemURL);
};

const getRecord = itemId => {
  return http.get(`${itemURL}${itemId}`);
};

export const item = {
  getList: getList,
  getRecord: getRecord,
};
