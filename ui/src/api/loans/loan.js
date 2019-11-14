import { http, apiConfig } from '../base';
import { sessionManager } from '@authentication/services';
import { toShortDate } from '../date';
import { DateTime } from 'luxon';
import { serializer } from './serializer';
import isEmpty from 'lodash/isEmpty';
import { prepareDateQuery, prepareSumQuery } from '../utils';
import { generatePath } from 'react-router-dom';

const apiPaths = {
  checkout: '/circulation/loans/checkout',
  emailOverdue: '/circulation/loans/:loanPid/email-overdue',
  item: '/circulation/loans/:loanPid',
  list: '/circulation/loans/',
  request: '/circulation/loans/request',
  replaceItem: '/circulation/loans/:loanPid/replace-item',
};

const get = async loanPid => {
  const path = generatePath(apiPaths.item, { loanPid: loanPid });
  const response = await http.get(path);
  response.data = serializer.fromJSON(response.data);
  return response;
};

const doAction = async (
  url,
  documentPid,
  patronPid,
  { itemPid = null, cancelReason = null } = {}
) => {
  const currentUser = sessionManager.user;
  const payload = {
    document_pid: documentPid,
    patron_pid: patronPid,
    transaction_location_pid: currentUser.locationPid,
    transaction_user_pid: currentUser.id,
  };
  if (itemPid) {
    payload.item_pid = itemPid;
  }
  if (cancelReason) {
    payload.cancel_reason = cancelReason;
  }

  const response = await http.post(url, payload);
  response.data = serializer.fromJSON(response.data);
  return response;
};

const doRequest = async (
  documentPid,
  patronPid,
  {
    requestExpireDate = null,
    requestStartDate = null,
    deliveryMethod = null,
  } = {}
) => {
  const currentUser = sessionManager.user;
  const payload = {
    document_pid: documentPid,
    patron_pid: patronPid,
    transaction_location_pid: currentUser.locationPid,
    transaction_user_pid: currentUser.id,
  };

  if (requestStartDate) {
    payload.request_start_date = requestStartDate;
  }
  if (requestExpireDate) {
    payload.request_expire_date = requestExpireDate;
  }
  if (deliveryMethod) {
    payload.delivery = {
      method: deliveryMethod,
    };
  }

  const response = await http.post(apiPaths.request, payload);
  response.data = serializer.fromJSON(response.data);
  return response;
};

const doCheckout = async (
  documentPid,
  itemPid,
  patronPid,
  { startDate = null, endDate = null, force = false } = {}
) => {
  const currentUser = sessionManager.user;
  const payload = {
    document_pid: documentPid,
    item_pid: itemPid,
    patron_pid: patronPid,
    transaction_location_pid: currentUser.locationPid,
    transaction_user_pid: currentUser.id,
  };

  if (startDate) {
    payload.start_date = startDate;
  }
  if (endDate) {
    payload.end_date = endDate;
  }
  if (force) {
    payload.force = true;
  }

  const response = await http.post(apiPaths.checkout, payload);
  response.data = serializer.fromJSON(response.data);
  return response;
};

const assignItemToLoan = async (itemPid, loanPid) => {
  const path = generatePath(apiPaths.replaceItem, { loanPid: loanPid });
  const payload = { item_pid: itemPid };
  const response = await http.post(path, payload);
  response.data = serializer.fromJSON(response.data);
  return response;
};

class QueryBuilder {
  constructor() {
    this.documentQuery = [];
    this.itemQuery = [];
    this.overdueQuery = [];
    this.patronQuery = [];
    this.renewedCountQuery = [];
    this.size = '';
    this.page = '';
    this.sortBy = '';
    this.startDateQuery = [];
    this.stateQuery = [];
    this.updatedQuery = [];
  }

  withDocPid(documentPid) {
    if (
      !documentPid ||
      (typeof documentPid != 'number' && isEmpty(documentPid))
    ) {
      throw TypeError('DocumentPid argument missing');
    }
    this.documentQuery.push(`document_pid:${prepareSumQuery(documentPid)}`);
    return this;
  }

  withItemPid(itemPid) {
    if (!itemPid || (typeof itemPid != 'number' && isEmpty(itemPid))) {
      throw TypeError('itemPid argument missing');
    }
    this.itemQuery.push(`item_pid:${prepareSumQuery(itemPid)}`);
    return this;
  }

  withPatronPid(patronPid) {
    if (!patronPid || (typeof patronPid != 'number' && isEmpty(patronPid))) {
      throw TypeError('patronPid argument missing');
    }
    this.patronQuery.push(`patron_pid:${prepareSumQuery(patronPid)}`);
    return this;
  }

  withState(state) {
    if (!state || isEmpty(state)) {
      throw TypeError('state argument missing');
    }
    this.stateQuery.push(`state:${prepareSumQuery(state)}`);
    return this;
  }

  overdue() {
    let now = toShortDate(DateTime.local());
    this.overdueQuery.push(encodeURI(`end_date:{* TO ${now}}`));
    return this;
  }

  withUpdated(dates) {
    this.updatedQuery.push(
      prepareDateQuery('_updated', dates.date, dates.from, dates.to)
    );
    return this;
  }

  withStartDate({ fromDate, toDate }) {
    if (fromDate || toDate)
      this.startDateQuery.push(
        prepareDateQuery('start_date', null, fromDate, toDate)
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
      isEmpty(renewals) ||
      !(typeof renewals === 'number' || typeof renewals === 'string')
    ) {
      throw TypeError('Renewal argument missing or invalid type');
    }
    this.renewedCountQuery.push(`extension_count:${renewals}`);
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
        this.renewedCountQuery,
        this.startDateQuery
      )
      .join(' AND ');
    return `(${searchCriteria})${this.sortBy}${this.size}${this.page}`;
  }
}

const queryBuilder = () => {
  return new QueryBuilder();
};

const list = async query => {
  const response = await http.get(`${apiPaths.list}?q=${query}`);
  response.data.total = response.data.hits.total;
  response.data.hits = response.data.hits.hits.map(hit =>
    serializer.fromJSON(hit)
  );
  return response;
};

const sendOverdueLoansMailReminder = async payload => {
  const path = generatePath(apiPaths.emailOverdue, {
    loanPid: payload.loanPid,
  });
  return await http.post(path, payload);
};

const count = async query => {
  const response = await http.get(`${apiPaths.list}?q=${query}`);
  response.data = response.data.hits.total;
  return response;
};

export const loan = {
  searchBaseURL: `${apiConfig.baseURL}${apiPaths.list}`,
  assignItemToLoan: assignItemToLoan,
  query: queryBuilder,
  list: list,
  get: get,
  count: count,
  doAction: doAction,
  doRequest: doRequest,
  doCheckout: doCheckout,
  sendOverdueLoansMailReminder: sendOverdueLoansMailReminder,
  serializer: serializer,
};
