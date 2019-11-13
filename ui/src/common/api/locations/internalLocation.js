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

const create = async data => {
  const resp = await http.post(`${internalLocationURL}`, data);
  resp.data = serializer.fromJSON(resp.data);
  return resp;
};

const update = async (ilocPid, data) => {
  const response = await http.put(`${internalLocationURL}${ilocPid}`, data);
  response.data = serializer.fromJSON(response.data);
  return response;
};

const list = async (query = '', size = 100) => {
  const queryString = `${internalLocationURL}?q=${query}&size=${size}`;
  const response = await http.get(queryString);
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
  create: create,
  update: update,
  url: internalLocationURL,
};
