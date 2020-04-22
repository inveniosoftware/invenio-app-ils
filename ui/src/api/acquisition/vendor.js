import { http, apiConfig } from '../base';
import { vendorSerializer as serializer } from './serializers';

const vendorURL = '/acquisition/vendors/';

const get = async pid => {
  const response = await http.get(`${vendorURL}${pid}`);
  response.data = serializer.fromJSON(response.data);
  return response;
};

const create = async data => {
  const resp = await http.post(`${vendorURL}`, data);
  resp.data = serializer.fromJSON(resp.data);
  return resp;
};

const update = async (pid, data) => {
  const response = await http.put(`${vendorURL}${pid}`, data);
  response.data = serializer.fromJSON(response.data);
  return response;
};

const del = async pid => {
  return await http.delete(`${vendorURL}${pid}`);
};

const list = async query => {
  const response = await http.get(`${vendorURL}?q=${query}`);
  response.data.total = response.data.hits.total;
  response.data.hits = response.data.hits.hits.map(hit =>
    serializer.fromJSON(hit)
  );
  return response;
};

const count = async query => {
  const response = await http.get(`${vendorURL}?q=${query}`);
  response.data = response.data.hits.total;
  return response;
};

class QueryBuilder {
  constructor() {
    this.addressQuery = [];
    this.nameQuery = [];
    this.emailQuery = [];
    this.sortByQuery = '';
  }

  withAddress(address) {
    if (!address) {
      throw TypeError('Address argument missing');
    }
    this.addressQuery.push(`address:"${address}"`);
    return this;
  }

  withName(name) {
    if (!name) {
      throw TypeError('Name argument missing');
    }
    this.nameQuery.push(`name:"${name}"`);
    return this;
  }

  withEmail(email) {
    if (!email) {
      throw TypeError('Email argument missing');
    }
    this.addressQuery.push(`email:"${email}"`);
    return this;
  }

  sortBy(order = 'bestmatch') {
    this.sortByQuery = `&sort=${order}`;
    return this;
  }

  qs() {
    const searchCriteria = this.addressQuery
      .concat(this.nameQuery, this.emailQuery)
      .join(' AND ');
    return `${searchCriteria}${this.sortByQuery}`;
  }
}

const queryBuilder = () => {
  return new QueryBuilder();
};

export const vendor = {
  searchBaseURL: `${apiConfig.baseURL}${vendorURL}`,
  get: get,
  create: create,
  update: update,
  delete: del,
  list: list,
  count: count,
  query: queryBuilder,
  serializer: serializer,
};
