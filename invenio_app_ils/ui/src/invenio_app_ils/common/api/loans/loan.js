import { http } from '../base';
import { toISO } from '../date';
import { DateTime } from 'luxon';
import { serializer } from './serializer';

const loanListURL = '/circulation/loans/';
const loanURL = loanPid => `${loanListURL}${loanPid}`;

const get = loanPid =>
  http.get(`${loanURL(loanPid)}`).then(response => {
    response.data = serializer.fromJSON(response.data);
    return response;
  });

const getLoanReplaceItemUrl = loanPid => `${loanURL(loanPid)}/replace-item`;

const postAction = (
  url,
  pid,
  loan,
  transactionUserPid,
  transactionLocationPid
) => {
  const now = DateTime.local();
  const payload = {
    transaction_user_pid: transactionUserPid,
    patron_pid: loan.patron_pid,
    transaction_location_pid: transactionLocationPid,
    transaction_date: toISO(now),
  };

  if ('item_pid' in loan) {
    payload['item_pid'] = loan.item_pid;
  } else if ('document_pid' in loan) {
    payload['document_pid'] = loan.document_pid;
  } else {
    throw new Error(
      `No 'item_pid' or 'document_pid' attached to loan '${pid}'`
    );
  }
  return http.post(url, payload).then(response => {
    response.data = serializer.fromJSON(response.data);
    return response;
  });
};

const assignItemToLoan = (itemPid, loanPid) => {
  const url = getLoanReplaceItemUrl(loanPid);
  const payload = { item_pid: itemPid };
  return http.post(url, payload).then(response => {
    response.data = serializer.fromJSON(response.data);
    return response;
  });
};

class QueryBuilder {
  constructor() {
    this.documentQuery = [];
    this.itemQuery = [];
    this.patronQuery = [];
    this.stateQuery = [];
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

  withItemPid(itemPid) {
    if (typeof itemPid === 'undefined' || itemPid === '') {
      throw TypeError('itemPid argument missing');
    }
    this.itemQuery.push(`item_pid:${QueryBuilder.paramToQuery(itemPid)}`);
    return this;
  }

  withPatronPid(patronPid) {
    if (typeof patronPid === 'undefined' || patronPid === '') {
      throw TypeError('patronPid argument missing');
    }
    this.patronQuery.push(`patron_pid:${QueryBuilder.paramToQuery(patronPid)}`);
    return this;
  }

  withState(state) {
    if (typeof state === 'undefined' || state === '') {
      throw TypeError('state argument missing');
    }
    this.stateQuery.push(`state:${QueryBuilder.paramToQuery(state)}`);
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
    return this.documentQuery
      .concat(this.itemQuery, this.patronQuery, this.stateQuery)
      .join(' AND ');
  }
}

const queryBuilder = () => {
  return new QueryBuilder();
};

const list = query => {
  return http.get(`${loanListURL}?q=${query}`).then(response => {
    response.data = response.data.hits.hits.map(hit =>
      serializer.fromJSON(hit)
    );
    return response;
  });
};

const count = query => {
  return http.get(`${loanURL}?q=${query}`).then(response => {
    response.data = response.data.hits.total;
    return response;
  });
};

export const loan = {
  assignItemToLoan: assignItemToLoan,
  query: queryBuilder,
  list: list,
  get: get,
  count: count,
  postAction: postAction,
  serializer: serializer,
  url: loanListURL,
};
