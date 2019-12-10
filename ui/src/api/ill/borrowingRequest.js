import { http, apiConfig } from '../base';
import { serializer } from './serializer';
import { generatePath } from 'react-router-dom';

const borrowingRequestUrl = '/ill/borrowing-requests/';
const apiPaths = {
  accept: `${borrowingRequestUrl}:borrowingRequestPid/accept`,
  item: `${borrowingRequestUrl}:borrowingRequestPid`,
  list: borrowingRequestUrl,
  reject: `${borrowingRequestUrl}:borrowingRequestPid/reject`,
};

const get = async borrowingRequestPid => {
  const response = await http.get(
    `${borrowingRequestUrl}${borrowingRequestPid}`
  );
  return response;
};

const del = async borrowingRequestPid => {
  const response = await http.delete(
    `${borrowingRequestUrl}${borrowingRequestPid}`
  );
  return response;
};

const performAction = async (urlPath, data) => {
  const response = await http.post(urlPath, data);
  response.data = serializer.fromJSON(response.data);
  return response;
};

const accept = async (borrowingRequestPid, data) => {
  const urlPath = generatePath(apiPaths.accept, {
    borrowingRequestPid: borrowingRequestPid,
  });
  return performAction(urlPath, data);
};

const reject = async (borrowingRequestPid, data) => {
  const urlPath = generatePath(apiPaths.reject, {
    borrowingRequestPid: borrowingRequestPid,
  });
  return performAction(urlPath, data);
};

const create = async data => {
  const response = await http.post(`${borrowingRequestUrl}`, data);
  return response;
};

const update = async (borrowingRequestPid, data) => {
  const response = await http.put(
    `${borrowingRequestUrl}${borrowingRequestPid}`,
    data
  );
  return response;
};

const list = async (query = '', size = 100) => {
  const response = await http.get(
    `${borrowingRequestUrl}?q=${query}&size=${size}`
  );
  response.data.total = response.data.hits.total;
  response.data.hits = response.data.hits.hits.map(hit =>
    serializer.fromJSON(hit)
  );
  return response;
};

export const borrowingRequest = {
  searchBaseURL: `${apiConfig.baseURL}${borrowingRequestUrl}`,
  accept: accept,
  reject: reject,
  create: create,
  delete: del,
  get: get,
  list: list,
  update: update,
  url: borrowingRequestUrl,
};
