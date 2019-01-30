import { http } from '../base';

const internalLocationURL = '/internal-locations/';

const get = internalLocationPid => {
  return http.get(`${internalLocationPid}${internalLocationPid}`);
};

const list = query => {
  if (query) {
    return http.get(`${internalLocationURL}?q=${query}`);
  } else {
    return http.get(`${internalLocationURL}`);
  }
};

export const internalLocation = {
  list: list,
  get: get,
  url: internalLocationURL,
};
