import { http, apiConfig } from '../base';
import { brwReqSerializer as serializer } from './serializers';

const borrowingRequestUrl = '/ill/borrowing-requests/';

const get = async borrowingRequestPid => {
  const response = await http.get(
    `${borrowingRequestUrl}${borrowingRequestPid}`
  );
  return response;
};

const create = async data => {
  const payload = serializer.toJSON(data);
  const resp = await http.post(`${borrowingRequestUrl}`, payload);
  resp.data = serializer.fromJSON(resp.data);
  return resp;
};

const update = async (borrowingRequestPid, data) => {
  const payload = serializer.toJSON(data);
  const resp = await http.put(
    `${borrowingRequestUrl}${borrowingRequestPid}`,
    payload
  );
  resp.data = serializer.fromJSON(resp.data);
  return resp;
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
  create: create,
  get: get,
  list: list,
  update: update,
  url: borrowingRequestUrl,
};
