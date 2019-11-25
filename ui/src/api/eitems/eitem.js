import { http, apiConfig } from '../base';
import { serializer } from './serializer';
import { prepareSumQuery } from '../utils';

const eitemURL = '/eitems/';

const get = async eitemPid => {
  const response = await http.get(`${eitemURL}${eitemPid}`);
  response.data = serializer.fromJSON(response.data);
  return response;
};

const del = async eitemPid => {
  const response = await http.delete(`${eitemURL}${eitemPid}`);
  return response;
};

const create = async data => {
  const resp = await http.post(`${eitemURL}`, data);
  resp.data = serializer.fromJSON(resp.data);
  return resp;
};

const update = async (eitemPid, data) => {
  const response = await http.put(`${eitemURL}${eitemPid}`, data);
  response.data = serializer.fromJSON(response.data);
  return response;
};

const list = async query => {
  const response = await http.get(`${eitemURL}?q=${query}`);
  response.data.total = response.data.hits.total;
  response.data.hits = response.data.hits.hits.map(hit =>
    serializer.fromJSON(hit)
  );
  return response;
};

const bucket = async eitemPid => {
  const resp = await http.post(`${eitemURL}${eitemPid}/bucket`);
  resp.data = serializer.fromJSON(resp.data);
  return resp;
};

const fileDownloaded = async (eitemPid, filename) => {
  return await http.post(`${eitemURL}${eitemPid}/stats`, {
    event: 'file-download',
    key: filename,
  });
};

class QueryBuilder {
  constructor() {
    this.documentQuery = [];
  }

  withDocPid(documentPid) {
    if (!documentPid) {
      throw TypeError('DocumentPid argument missing');
    }
    this.documentQuery.push(`document_pid:${prepareSumQuery(documentPid)}`);
    return this;
  }

  qs() {
    return this.documentQuery.join(' AND ');
  }
}

const queryBuilder = () => {
  return new QueryBuilder();
};

export const eitem = {
  bucket: bucket,
  create: create,
  delete: del,
  fileDownloaded: fileDownloaded,
  get: get,
  list: list,
  query: queryBuilder,
  searchBaseURL: `${apiConfig.baseURL}${eitemURL}`,
  update: update,
};
