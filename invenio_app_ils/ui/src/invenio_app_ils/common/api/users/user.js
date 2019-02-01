import { http } from '../base';
import { serializer } from './serializer';

const userURL = '/users/';

const get = userPid => {
  return http.get(`${userURL}${userPid}`).then(response => {
    response.data = serializer.fromJSON(response.data);
    return response;
  });
};

export const user = {
  url: userURL,
  get: get,
};
