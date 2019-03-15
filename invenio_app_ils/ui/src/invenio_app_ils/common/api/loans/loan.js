import { http } from '../base';
import { toISO, toShortDate } from '../date';
import { DateTime } from 'luxon';
import { serializer } from './serializer';
import _isEmpty from 'lodash/isEmpty';
import { prepareDateQuery, prepareSumQuery } from '../utils';
import { ApiURLS } from '../urls';
import { generatePath } from 'react-router-dom';

const loanListURL = ApiURLS.loans.list;
const loanURL = loanPid => {
  return generatePath(ApiURLS.loans.loan, { loanPid: loanPid });
};

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
    this.sortBy = '';
    this.documentQuery = [];
    this.itemQuery = [];
    this.patronQuery = [];
    this.stateQuery = [];
    this.overdueQuery = [];
    this.updatedQuery = [];
    this.renewedCountQuery = [];
  }

  withDocPid(documentPid) {
    if (
      !documentPid ||
      (typeof documentPid != 'number' && _isEmpty(documentPid))
    ) {
      throw TypeError('DocumentPid argument missing');
    }
    this.documentQuery.push(`document_pid:${prepareSumQuery(documentPid)}`);
    return this;
  }

  withItemPid(itemPid) {
    if (!itemPid || (typeof itemPid != 'number' && _isEmpty(itemPid))) {
      throw TypeError('itemPid argument missing');
    }
    this.itemQuery.push(`item_pid:${prepareSumQuery(itemPid)}`);
    return this;
  }

  withPatronPid(patronPid) {
    if (!patronPid || (typeof patronPid != 'number' && _isEmpty(patronPid))) {
      throw TypeError('patronPid argument missing');
    }
    this.patronQuery.push(`patron_pid:${prepareSumQuery(patronPid)}`);
    return this;
  }

  withState(state) {
    if (!state || _isEmpty(state)) {
      throw TypeError('state argument missing');
    }
    this.stateQuery.push(`state:${prepareSumQuery(state)}`);
    return this;
  }

  overdue() {
    let now = toShortDate(DateTime.local());
    this.overdueQuery.push(encodeURI(`request_expire_date:{* TO ${now}}`));
    return this;
  }

  withUpdated(dates) {
    this.updatedQuery.push(
      prepareDateQuery('_updated', dates.date, dates.from, dates.to)
    );
    return this;
  }

  /**
   * Combine elasticsearch query for number of renewals
   * @param renewals string, number or array
   * when number it asks for exact number
   * in string there is possibility of passing comparison operators
   */
  withRenewedCount(renewals) {
    if (
      !renewals ||
      _isEmpty(renewals) ||
      !(typeof renewals === 'number' || typeof renewals === 'string')
    ) {
      throw TypeError('Renewal argument missing or invalid type');
    }
    this.renewedCountQuery.push(`extension_count:${renewals}`);
    return this;
  }

  sortByNewest() {
    this.sortBy = `&sort=-mostrecent`;
    return this;
  }

  qs() {
    const searchCriteria = this.documentQuery
      .concat(
        this.itemQuery,
        this.patronQuery,
        this.stateQuery,
        this.overdueQuery,
        this.updatedQuery,
        this.renewedCountQuery
      )
      .join(' AND ');
    return `(${searchCriteria})${this.sortBy}`;
  }
}

const queryBuilder = () => {
  return new QueryBuilder();
};

const list = query => {
  return http.get(`${loanListURL}?q=${query}`).then(response => {
    response.data.total = response.data.hits.total;
    response.data.hits = response.data.hits.hits.map(hit =>
      serializer.fromJSON(hit)
    );
    return response;
  });
};

const count = query => {
  return http.get(`${loanListURL}?q=${query}`).then(response => {
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
