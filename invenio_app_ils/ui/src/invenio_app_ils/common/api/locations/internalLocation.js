import { http } from '../base';
import { internalLocationSerializer as serializer } from './serializer';

const internalLocationURL = '/internal-locations/';

const get = internalLocationPid => {
  return http
    .get(`${internalLocationPid}${internalLocationPid}`)
    .then(response => {
      response.data = serializer.fromJSON(response.data);
      return response;
    });
};

const list = query => {
  if (query) {
    return http.get(`${internalLocationURL}?q=${query}`).then(response => {
      response.data.total = response.data.hits.total;
      response.data.hits = response.data.hits.hits.map(hit =>
        serializer.fromJSON(hit)
      );
      return response;
    });
  } else {
    return http.get(`${internalLocationURL}`).then(response => {
      response.data.total = response.data.hits.total;
      response.data.hits = response.data.hits.hits.map(hit =>
        serializer.fromJSON(hit)
      );
      return response;
    });
  }
};
export const internalLocation = {
  list: list,
  get: get,
  url: internalLocationURL,
};
