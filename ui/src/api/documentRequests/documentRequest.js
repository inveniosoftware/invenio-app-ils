import { http, apiConfig } from '../base';
import { serializer } from './serializer';
import { prepareSumQuery } from '../utils';
import isEmpty from 'lodash/isEmpty';
import { generatePath } from 'react-router-dom';

const documentRequestURL = '/document-requests/';
const apiPaths = {
  accept: `${documentRequestURL}:docReqPid/accept`,
  item: `${documentRequestURL}:docReqPid`,
  list: documentRequestURL,
  reject: `${documentRequestURL}:docReqPid/reject`,
  document: `${documentRequestURL}:docReqPid/document`,
  provider: `${documentRequestURL}:docReqPid/provider`,
};

const create = async data => {
  const response = await http.post(apiPaths.list, data);
  response.data = serializer.fromJSON(response.data);
  return response;
};

const get = async docRequestPid => {
  const path = generatePath(apiPaths.item, { docReqPid: docRequestPid });
  const response = await http.get(path);
  response.data = serializer.fromJSON(response.data);
  return response;
};

const del = async docRequestPid => {
  const path = generatePath(apiPaths.item, { docReqPid: docRequestPid });
  const response = await http.delete(path);
  return response;
};

const performAction = async (urlPath, data) => {
  const response = await http.post(urlPath, data);
  response.data = serializer.fromJSON(response.data);
  return response;
};

const accept = async docRequestPid => {
  const urlPath = generatePath(apiPaths.accept, { docReqPid: docRequestPid });
  return performAction(urlPath);
};

const addDocument = async (docReqPid, data) => {
  const url = generatePath(apiPaths.document, { docReqPid: docReqPid });
  const response = await http.post(url, data);
  return response;
};

const removeDocument = async (docReqPid, data) => {
  const url = generatePath(apiPaths.document, { docReqPid: docReqPid });
  // https://github.com/axios/axios/issues/897#issuecomment-343715381
  const response = await http.delete(url, { data: data });
  return response;
};

const addProvider = async (docReqPid, data) => {
  const url = generatePath(apiPaths.provider, { docReqPid: docReqPid });
  const response = await http.post(url, data);
  return response;
};

const removeProvider = async docReqPid => {
  const url = generatePath(apiPaths.provider, { docReqPid: docReqPid });
  const response = await http.delete(url);
  return response;
};

const reject = async (docRequestPid, data) => {
  const urlPath = generatePath(apiPaths.reject, { docReqPid: docRequestPid });
  return performAction(urlPath, data);
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
    this.stateQuery.push(`state:"${prepareSumQuery(state)}"`);
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

const list = async query => {
  const response = await http.get(`${documentRequestURL}?q=${query}`);
  response.data.total = response.data.hits.total;
  response.data.hits = response.data.hits.hits.map(hit =>
    serializer.fromJSON(hit)
  );
  return response;
};

const count = async query => {
  const response = await http.get(`${documentRequestURL}?q=${query}`);
  response.data = response.data.hits.total;
  return response;
};

export const documentRequest = {
  addDocument: addDocument,
  addProvider: addProvider,
  accept: accept,
  count: count,
  create: create,
  delete: del,
  get: get,
  list: list,
  query: queryBuilder,
  reject: reject,
  removeDocument: removeDocument,
  removeProvider: removeProvider,
  searchBaseURL: `${apiConfig.baseURL}${documentRequestURL}`,
  serializer: serializer,
};
