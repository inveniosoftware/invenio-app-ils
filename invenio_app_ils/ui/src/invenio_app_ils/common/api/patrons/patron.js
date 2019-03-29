import { http } from '../base';
import { serializer } from './serializer';

const listUrl = '/patrons/';
// Here we use a different url to access Patron details
// as patrons are only records indexed in elasticsearch
// but not stored in the database. Instead we are using
// `invenio_accounts_rest` users endpoint to retrieve
// individual patron's information.
const detailsUrl = '/users/';

const get = patronPid => {
  return http.get(`${detailsUrl}${patronPid}`).then(response => {
    response.data = serializer.fromJSON(response.data);
    return response;
  });
};

export const patron = {
  url: listUrl,
  get: get,
};
