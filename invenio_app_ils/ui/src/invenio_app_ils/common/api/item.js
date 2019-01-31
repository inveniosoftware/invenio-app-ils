import { http } from './base';

const itemURL = '/items/';

const get = itemPid => {
  return http.get(`${itemURL}${itemPid}`);
};

const buildItemsQuery = (documentPid, state, extraQuery) => {
  const qsDoc = documentPid ? `document_pid:${documentPid}` : '';
  const qsState = state ? ` AND state:${state}` : '';
  const qsExtra = extraQuery ? `${extraQuery}` : '';
  return `${qsDoc}${qsState}${qsExtra}`;
};

const fetchItems = (documentPid, state, extraQuery) => {
  const qs = buildItemsQuery(documentPid, state, extraQuery);
  return http.get(`${itemURL}?q=${qs}`);
};

const fetchItemsByDocPid = (documentPid, config) => {
  const qs = `document_pid:${documentPid} AND status:${
    config.items.available.status
  }`;
  return http.get(`${itemURL}?q=${qs}`);
};

export const item = {
  buildItemsQuery: buildItemsQuery,
  fetchItems: fetchItems,
  fetchItemsByDocPid: fetchItemsByDocPid,
  get: get,
  url: itemURL,
};
