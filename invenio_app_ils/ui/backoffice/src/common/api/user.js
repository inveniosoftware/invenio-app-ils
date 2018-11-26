import { http } from './base';

const userURL = '/users/';

const get = userPid => {
  return http.get(`${userURL}${userPid}`);
};

export const user = {
  url: userURL,
  get: get,
};
