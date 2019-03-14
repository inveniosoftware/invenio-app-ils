import { http } from '../base';
import { serializer } from './serializer';

const documentURL = '/documents/';

const get = documentPid => {
  return http.get(`${documentURL}${documentPid}`).then(response => {
    response.data = serializer.fromJSON(response.data);
    return response;
  });
};

class QueryBuilder {
  constructor() {
    this.overbookedQuery = [];
    this.availableItemsQuery = [];
    this.withPendingLoansQuery = [];
    this.withKeywordQuery = [];
  }

  overbooked() {
    this.overbookedQuery.push(`circulation.overbooked:true`);
    return this;
  }

  withAvailableItems() {
    this.availableItemsQuery.push('circulation.loanable_items:>0');
    return this;
  }

  withPendingLoans() {
    this.withPendingLoansQuery.push('circulation.pending_loans:>0');
    return this;
  }

  withKeyword(keyword) {
    this.withKeywordQuery.push(`keywords.name:"${keyword.name}"`);
    return this;
  }

  qs() {
    return this.overbookedQuery
      .concat(
        this.availableItemsQuery,
        this.withPendingLoansQuery,
        this.withKeywordQuery
      )
      .join(' AND ');
  }
}

const queryBuilder = () => {
  return new QueryBuilder();
};

const list = query => {
  return http.get(`${documentURL}?q=${query}`).then(response => {
    response.data.total = response.data.hits.total;
    response.data.hits = response.data.hits.hits.map(hit =>
      serializer.fromJSON(hit)
    );
    return response;
  });
};

const count = query => {
  return http.get(`${documentURL}?q=${query}`).then(response => {
    response.data = response.data.hits.total;
    return response;
  });
};

export const document = {
  get: get,
  list: list,
  count: count,
  query: queryBuilder,
  serializer: serializer,
  url: documentURL,
};
