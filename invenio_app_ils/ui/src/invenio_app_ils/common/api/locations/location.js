import { http } from '../base';

const locationURL = '/locations/';

const get = locationPid => {
  return http.get(`${locationURL}${locationPid}`);
};

const list = query => {
  if (query) {
    return http.get(`${locationURL}?q=${query}`);
  } else {
    return http.get(`${locationURL}`);
  }
};

export const location = {
  list: list,
  get: get,
  url: locationURL,
};
