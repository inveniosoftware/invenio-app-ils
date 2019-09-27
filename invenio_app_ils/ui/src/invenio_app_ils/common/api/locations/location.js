import { http } from '../base';
import { locationSerializer as serializer } from './serializer';

const locationURL = '/locations/';

const get = async locationPid => {
  const response = await http.get(`${locationURL}${locationPid}`);
  response.data = serializer.fromJSON(response.data);
  return response;
};

const del = async locationPid => {
  const response = await http.delete(`${locationURL}${locationPid}`);
  return response;
};

const create = async data => {
  const resp = await http.post(`${locationURL}`, data);
  resp.data = serializer.fromJSON(resp.data);
  return resp;
};

const update = async (locationPid, data) => {
  const response = await http.put(`${locationURL}${locationPid}`, data);
  response.data = serializer.fromJSON(response.data);
  return response;
};

const list = async (query = '') => {
  const response = await http.get(`${locationURL}?q=${query}`);
  response.data.total = response.data.hits.total;
  response.data.hits = response.data.hits.hits.map(hit =>
    serializer.fromJSON(hit)
  );
  return response;
};

export const location = {
  list: list,
  get: get,
  delete: del,
  create: create,
  update: update,
  url: locationURL,
};
