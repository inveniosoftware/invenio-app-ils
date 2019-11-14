import { http } from '../base';
import { serializer } from './serializer';

const tagURL = '/tags/';

const list = query => {
  return http.get(`${tagURL}?q=${query}`).then(response => {
    response.data.total = response.data.hits.total;
    response.data.hits = response.data.hits.hits.map(hit =>
      serializer.fromJSON(hit)
    );
    return response;
  });
};

const create = async data => {
  const resp = await http.post(`${tagURL}`, data);
  resp.data = serializer.fromJSON(resp.data);
  return resp;
};

const update = async (tagPid, data) => {
  const response = await http.put(`${tagURL}${tagPid}`, data);
  response.data = serializer.fromJSON(response.data);
  return response;
};

export const tag = {
  list: list,
  create: create,
  update: update,
  serializer: serializer,
  url: tagURL,
};
