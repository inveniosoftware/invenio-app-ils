import { http, apiConfig } from '../base';
import {
  brwReqSerializer as serializer,
  brwReqCreateLoanSerializer as createLoanSerializer,
} from './serializers';
import { prepareSumQuery } from '../utils';

const borrowingRequestUrl = '/ill/borrowing-requests/';

const get = async pid => {
  const response = await http.get(`${borrowingRequestUrl}${pid}`);
  response.data = serializer.fromJSON(response.data);
  return response;
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

const createLoan = async (borrowingRequestPid, loanStartDate, loanEndDate) => {
  const payload = createLoanSerializer.toJSON({
    loan_start_date: loanStartDate,
    loan_end_date: loanEndDate,
  });
  const resp = await http.post(
    `${borrowingRequestUrl}${borrowingRequestPid}/create-loan`,
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
    this.page = '';
    this.patronQuery = [];
    this.libraryQuery = [];
    this.libraryPidQuery = [];
    this.size = '';
    this.sortByQuery = '';
    this.stateQuery = [];
  }

  withState(state) {
    if (!state) {
      throw TypeError('State argument missing');
    }
    this.stateQuery.push(`status:${prepareSumQuery(state)}`);
    return this;
  }

  withPatron(patronPid) {
    if (!patronPid) {
      throw TypeError('Patron PID argument missing');
    }
    this.patronQuery.push(`patron_pid:${patronPid}`);
    return this;
  }

  withSize(size) {
    if (size > 0) this.size = `&size=${size}`;
    return this;
  }

  withPage(page = 0) {
    if (page > 0) this.page = `&page=${page}`;
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
      .concat(this.stateQuery)
      .join(' AND ');
    return `(${searchCriteria})${this.sortByQuery}${this.size}${this.page}`;
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
  createLoan: createLoan,
  query: queryBuilder,
  url: borrowingRequestUrl,
};
