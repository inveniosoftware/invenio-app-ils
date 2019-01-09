import { http } from './base';

const itemURL = '/items/';

const get = itemPid => {
  return http.get(`${itemURL}${itemPid}`);
};

const fetchItemsByDocPid = (documentPid, sortBy, sortOrder) => {
  const qs = `document_pid:${documentPid}`;
  const sort =
    sortBy === 'transaction_date' ? `transaction_date` : `start_date`;
  const sortByOrder = sortOrder === 'asc' ? `${sort}:asc` : `${sort}:desc`;
  // return http.get(`${itemUrl}?q=${qs}&sort:${sortByOrder}`);
  return http.get(`${itemURL}?q=${qs}&sort:${sortByOrder}`);
};

export const item = {
  fetchItemsByDocPid: fetchItemsByDocPid,
  get: get,
  url: itemURL,
};
