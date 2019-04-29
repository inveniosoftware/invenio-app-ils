import { http } from '../base';
import { internalLocationSerializer as serializer } from './serializer';

const internalLocationURL = '/internal-locations/';

const get = async internalLocationPid => {
  const response = await http.get(
    `${internalLocationURL}${internalLocationPid}`
  );
  response.data = serializer.fromJSON(response.data);
  return response;
};

const del = async ilocPid => {
  const response = await http.delete(`${internalLocationURL}${ilocPid}`);
  return response;
};

const list = async (query = '') => {
  const response = await http.get(`${internalLocationURL}?q=${query}`);
  response.data.total = response.data.hits.total;
  response.data.hits = response.data.hits.hits.map(hit =>
    serializer.fromJSON(hit)
  );
  return response;
};

export const internalLocation = {
  list: list,
  get: get,
  delete: del,
  url: internalLocationURL,
};
