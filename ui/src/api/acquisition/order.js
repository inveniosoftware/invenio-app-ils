import { http, apiConfig } from '../base';
import { orderSerializer as serializer } from './serializers';

const orderURL = '/acquisition/orders/';

const get = pid => {
  return http.get(`${orderURL}${pid}`).then(response => {
    response.data = serializer.fromJSON(response.data);
    return response;
  });
};

const create = async data => {
  const payload = serializer.toJSON(data);
  const resp = await http.post(`${orderURL}`, payload);
  resp.data = serializer.fromJSON(resp.data);
  return resp;
};

const update = async (pid, data) => {
  const payload = serializer.toJSON(data);
  const response = await http.put(`${orderURL}${pid}`, payload);
  response.data = serializer.fromJSON(response.data);
  return response;
};

const list = async query => {
  const response = await http.get(`${orderURL}?q=${query}`);
  response.data.total = response.data.hits.total;
  response.data.hits = response.data.hits.hits.map(hit =>
    serializer.fromJSON(hit)
  );
  return response;
};

const count = query => {
  return http.get(`${orderURL}?q=${query}`).then(response => {
    response.data = response.data.hits.total;
    return response;
  });
};

class QueryBuilder {
  constructor() {
    this.patronQuery = [];
    this.recipientQuery = [];
    this.vendorQuery = [];
    this.vendorPidQuery = [];
    this.sortByQuery = '';
  }

  withPatron(patronPid) {
    if (!patronPid) {
      throw TypeError('Patron PID argument missing');
    }
    this.patronQuery.push(`order_lines.patron_pid:${patronPid}`);
    return this;
  }

  withRecipient(recipient) {
    if (!recipient) {
      throw TypeError('Recipient argument missing');
    }
    this.recipientQuery.push(`recipient:${recipient}`);
    return this;
  }

  withVendor(name) {
    if (!name) {
      throw TypeError('Vendor name argument missing');
    }
    this.vendorQuery.push(`vendor.name:"${name}"`);
    return this;
  }

  withVendorPid(pid) {
    if (!pid) {
      throw TypeError('Vendor pid argument missing');
    }
    this.vendorPidQuery.push(`vendor_pid:${pid}`);
    return this;
  }

  sortBy(order = 'bestmatch') {
    this.sortByQuery = `&sort=${order}`;
    return this;
  }

  qs() {
    const searchCriteria = this.patronQuery
      .concat(this.recipientQuery, this.vendorQuery, this.vendorPidQuery)
      .join(' AND ');
    return `${searchCriteria}${this.sortByQuery}`;
  }
}

const queryBuilder = () => {
  return new QueryBuilder();
};

export const order = {
  searchBaseURL: `${apiConfig.baseURL}${orderURL}`,
  get: get,
  create: create,
  update: update,
  list: list,
  count: count,
  query: queryBuilder,
  serializer: serializer,
};
