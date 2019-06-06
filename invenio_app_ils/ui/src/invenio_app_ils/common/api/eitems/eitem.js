import { http } from '../base';
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

const list = async query => {
  const response = await http.get(`${eitemURL}?q=${query}`);
  response.data.total = response.data.hits.total;
  response.data.hits = response.data.hits.hits.map(hit =>
    serializer.fromJSON(hit)
  );
  return response;
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
  query: queryBuilder,
  list: list,
  get: get,
  delete: del,
  url: eitemURL,
};
