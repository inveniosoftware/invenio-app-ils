import { http } from '../base';
import { locationSerializer as serializer } from './serializer';

const locationURL = '/locations/';

const get = locationPid => {
  return http.get(`${locationURL}${locationPid}`).then(response => {
    response.data = serializer.fromJSON(response.data);
    return response;
  });
};

const list = query => {
  if (query) {
    return http.get(`${locationURL}?q=${query}`).then(response => {
      response.data.total = response.data.hits.total;
      response.data.hits = response.data.hits.hits.map(hit =>
        serializer.fromJSON(hit)
      );
      return response;
    });
  } else {
    return http.get(`${locationURL}`).then(response => {
      response.data.total = response.data.hits.total;
      response.data.hits = response.data.hits.hits.map(hit =>
        serializer.fromJSON(hit)
      );
      return response;
    });
  }
};

export const location = {
  list: list,
  get: get,
  url: locationURL,
};
