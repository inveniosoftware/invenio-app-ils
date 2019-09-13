import { http, apiConfig } from '../base';
import { serializer } from './serializer';
import { prepareSumQuery } from '../utils';

const documentRequestURL = '/document-requests/';
const apiURL = `${apiConfig.baseURL}${documentRequestURL}`;

const get = docRequestPid => {
  return http.get(`${documentRequestURL}${docRequestPid}`).then(response => {
    response.data = serializer.fromJSON(response.data);
    return response;
  });
};

const del = async docRequestPid => {
  const response = await http.delete(`${documentRequestURL}${docRequestPid}`);
  return response;
};

const patch = async (docRequestPid, ops) => {
  const response = await http.patch(
    `${documentRequestURL}${docRequestPid}`,
    ops,
    {
      headers: { 'Content-Type': 'application/json-patch+json' },
    }
  );
  response.data = serializer.fromJSON(response.data);
  return response;
};

class QueryBuilder {
  constructor() {
    this.documentQuery = [];
    this.withStateQuery = [];
  }

  withState(state) {
    if (!state) {
      throw TypeError('State argument missing');
    }
    this.withStateQuery.push(`state:"${state}"`);
    return this;
  }

  withDocPid(documentPid) {
    if (!documentPid) {
      throw TypeError('DocumentPid argument missing');
    }
    this.documentQuery.push(`document_pid:${prepareSumQuery(documentPid)}`);
    return this;
  }

  qs() {
    return this.withStateQuery.concat(this.documentQuery).join(' AND ');
  }
}

const queryBuilder = () => {
  return new QueryBuilder();
};

const list = query => {
  return http.get(`${documentRequestURL}?q=${query}`).then(response => {
    response.data.total = response.data.hits.total;
    response.data.hits = response.data.hits.hits.map(hit =>
      serializer.fromJSON(hit)
    );
    return response;
  });
};

const count = query => {
  return http.get(`${documentRequestURL}?q=${query}`).then(response => {
    response.data = response.data.hits.total;
    return response;
  });
};

export const documentRequest = {
  url: apiURL,
  get: get,
  delete: del,
  patch: patch,
  list: list,
  count: count,
  query: queryBuilder,
  serializer: serializer,
};
