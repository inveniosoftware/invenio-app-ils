import { http, apiConfig } from '../base';
import { serializer } from './serializer';
import { prepareSumQuery } from '../utils';
import isEmpty from 'lodash/isEmpty';

const documentRequestURL = '/document-requests/';

const create = async data => {
  const url = `${documentRequestURL}`;
  const response = await http.post(url, data);
  response.data = serializer.fromJSON(response.data);
  return response;
};

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
    this.page = '';
    this.patronQuery = [];
    this.size = '';
    this.sortBy = '';
    this.stateQuery = [];
  }

  withState(state) {
    if (!state) {
      throw TypeError('State argument missing');
    }
    this.stateQuery.push(`state:"${state}"`);
    return this;
  }

  withDocPid(documentPid) {
    if (!documentPid) {
      throw TypeError('DocumentPid argument missing');
    }
    this.documentQuery.push(`document_pid:${prepareSumQuery(documentPid)}`);
    return this;
  }

  withPatronPid(patronPid) {
    if (!patronPid || (typeof patronPid != 'number' && isEmpty(patronPid))) {
      throw TypeError('patronPid argument missing');
    }
    this.patronQuery.push(`patron_pid:${prepareSumQuery(patronPid)}`);
    return this;
  }

  withPage(page = 0) {
    if (page > 0) this.page = `&page=${page}`;
    return this;
  }

  withSize(size) {
    if (size > 0) this.size = `&size=${size}`;
    return this;
  }

  sortByNewest() {
    this.sortBy = `&sort=-mostrecent`;
    return this;
  }

  qs() {
    const searchCriteria = this.documentQuery
      .concat(this.patronQuery, this.stateQuery)
      .join(' AND ');
    return `(${searchCriteria})${this.sortBy}${this.size}${this.page}`;
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
  searchBaseURL: `${apiConfig.baseURL}${documentRequestURL}`,
  create: create,
  get: get,
  delete: del,
  patch: patch,
  list: list,
  count: count,
  query: queryBuilder,
  serializer: serializer,
};
