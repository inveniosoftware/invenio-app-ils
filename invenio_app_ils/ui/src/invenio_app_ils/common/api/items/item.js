import { http } from '../base';

const itemURL = '/items/';

const get = itemPid => {
  return http.get(`${itemURL}${itemPid}`);
};

class QueryBuilder {
  constructor() {
    this.documentQuery = [];
    this.statusQuery = [];
  }

  withDocPid(documentPid) {
    if (typeof documentPid === 'undefined' || documentPid === '') {
      throw TypeError('DocumentPid argument missing');
    }
    this.documentQuery.push(
      `document_pid:${QueryBuilder.paramToQuery(documentPid)}`
    );
    return this;
  }

  withStatus(status) {
    if (typeof status === 'undefined' || status === '') {
      throw TypeError('Status argument missing');
    }
    this.statusQuery.push(`status:${QueryBuilder.paramToQuery(status)}`);
    return this;
  }

  static paramToQuery(param) {
    if (Array.isArray(param)) {
      const paramQuery = param.join(' OR ');
      return `(${paramQuery})`;
    } else {
      return param;
    }
  }

  qs() {
    return this.documentQuery.concat(this.statusQuery).join(' AND ');
  }
}

const queryBuilder = () => {
  return new QueryBuilder();
};

const list = query => {
  return http.get(`${itemURL}?q=${query}`);
};

export const item = {
  query: queryBuilder,
  list: list,
  get: get,
  url: itemURL,
};
