import { http } from './base';

const itemURL = '/items/';

const get = itemPid => {
  return http.get(`${itemURL}${itemPid}`);
};

const fetchItemsByDocPid = documentPid => {
  const qs = `(document_pid:${documentPid} AND NOT(status:MISSING))`;
  return http.get(`${itemURL}?q=${qs}`);
};

export const item = {
  fetchItemsByDocPid: fetchItemsByDocPid,
  get: get,
  url: itemURL,
};
