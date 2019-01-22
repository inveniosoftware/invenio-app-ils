import { http } from './base';

const itemURL = '/items/';

const get = itemPid => {
  return http.get(`${itemURL}${itemPid}`);
};

const fetchItemsByDocPid = (documentPid, config) => {
  const qs = `(document_pid:${documentPid} AND status:${
    config.items.available.status
  })`;
  return http.get(`${itemURL}?q=${qs}`);
};

export const item = {
  fetchItemsByDocPid: fetchItemsByDocPid,
  get: get,
  url: itemURL,
};
