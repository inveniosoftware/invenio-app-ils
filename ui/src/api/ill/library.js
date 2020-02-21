import { http, apiConfig } from '../base';
import { librarySerializer as serializer } from './serializers';

const libraryUrl = '/ill/libraries/';

const get = async libraryPid => {
  const response = await http.get(`${libraryUrl}${libraryPid}`);
  response.data = serializer.fromJSON(response.data);
  return response;
};

const del = async libraryPid => {
  const response = await http.delete(`${libraryUrl}${libraryPid}`);
  return response;
};

const create = async data => {
  const response = await http.post(`${libraryUrl}`, data);
  response.data = serializer.fromJSON(response.data);
  return response;
};

const update = async (libraryPid, data) => {
  const response = await http.put(`${libraryUrl}${libraryPid}`, data);
  response.data = serializer.fromJSON(response.data);
  return response;
};

const list = async (query = '', size = 100) => {
  const response = await http.get(`${libraryUrl}?q=${query}&size=${size}`);
  response.data.total = response.data.hits.total;
  response.data.hits = response.data.hits.hits.map(hit =>
    serializer.fromJSON(hit)
  );
  return response;
};

export const library = {
  searchBaseURL: `${apiConfig.baseURL}${libraryUrl}`,
  create: create,
  delete: del,
  get: get,
  list: list,
  update: update,
  url: libraryUrl,
};
