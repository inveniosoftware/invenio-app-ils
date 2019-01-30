import { http } from '../base';

const documentURL = '/documents/';

const get = documentPid => {
  return http.get(`${documentURL}${documentPid}`);
};

export const document = {
  url: documentURL,
  get: get,
};
