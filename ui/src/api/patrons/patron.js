import { http, apiConfig } from '../base';
import { serializer } from './serializer';

const listUrl = '/patrons/';
// Here we use a different url to access Patron details
// as patrons are only records indexed in elasticsearch
// but not stored in the database. Instead we are using
// `invenio_accounts_rest` users endpoint to retrieve
// individual patron's information.

const get = patronPid => {
  return http.get(`${listUrl}?q=id:${patronPid}`).then(response => {
    response.data = serializer.fromJSON(response.data.hits.hits[0]);
    return response;
  });
};

const list = queryText => {
  return http.get(`${listUrl}?q=${queryText}*`).then(response => {
    response.data.total = response.data.hits.total;
    response.data.hits = response.data.hits.hits.map(hit =>
      serializer.fromJSON(hit)
    );
    return response;
  });
};

export const patron = {
  searchBaseURL: `${apiConfig.baseURL}${listUrl}`,
  get: get,
  list: list,
};
