import { http, apiConfig } from '../base';
import { brwReqSerializer as serializer } from './serializers';

const borrowingRequestUrl = '/ill/borrowing-requests/';

const get = async pid => {
  return http.get(`${borrowingRequestUrl}${pid}`).then(response => {
    response.data = serializer.fromJSON(response.data);
    return response;
  });
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

const list = async query => {
  const response = await http.get(`${borrowingRequestUrl}?q=${query}`);
  response.data.total = response.data.hits.total;
  response.data.hits = response.data.hits.hits.map(hit =>
    serializer.fromJSON(hit)
  );
  return response;
};

class QueryBuilder {
  constructor() {
    this.patronQuery = [];
    this.libraryQuery = [];
    this.libraryPidQuery = [];
    this.sortByQuery = '';
  }

  withPatron(patronPid) {
    if (!patronPid) {
      throw TypeError('Patron PID argument missing');
    }
    this.patronQuery.push(`patron_pid:${patronPid}`);
    return this;
  }

  withLibrary(name) {
    if (!name) {
      throw TypeError('Library name argument missing');
    }
    this.libraryQuery.push(`library.name:"${name}"`);
    return this;
  }

  withLibraryPid(pid) {
    if (!pid) {
      throw TypeError('Library pid argument missing');
    }
    this.libraryPidQuery.push(`library_pid:${pid}`);
    return this;
  }

  sortBy(order = 'bestmatch') {
    this.sortByQuery = `&sort=${order}`;
    return this;
  }

  qs() {
    const searchCriteria = this.patronQuery
      .concat(this.libraryQuery, this.libraryPidQuery)
      .join(' AND ');
    return `${searchCriteria}${this.sortByQuery}`;
  }
}

const queryBuilder = () => {
  return new QueryBuilder();
};

export const borrowingRequest = {
  searchBaseURL: `${apiConfig.baseURL}${borrowingRequestUrl}`,
  create: create,
  get: get,
  list: list,
  update: update,
  query: queryBuilder,
  url: borrowingRequestUrl,
};
