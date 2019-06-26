import { http } from '../base';
import { serializer } from './serializer';
import { prepareSumQuery } from '../utils';

const documentURL = '/documents/';

const get = documentPid => {
  return http.get(`${documentURL}${documentPid}`).then(response => {
    response.data = serializer.fromJSON(response.data);
    return response;
  });
};

const del = async docPid => {
  const response = await http.delete(`${documentURL}${docPid}`);
  return response;
};

const patch = async (documentPid, ops) => {
  const response = await http.patch(`${documentURL}${documentPid}`, ops, {
    headers: { 'Content-Type': 'application/json-patch+json' },
  });
  response.data = serializer.fromJSON(response.data);
  return response;
};

class QueryBuilder {
  constructor() {
    this.overbookedQuery = [];
    this.currentlyOnLoanQuery = [];
    this.availableItemsQuery = [];
    this.withPendingLoansQuery = [];
    this.withKeywordQuery = [];
    this.withDocumentTypeQuery = [];
    this.withEitemsQuery = [];
    this.withSeriesQuery = [];
    this.sortByQuery = '';
  }

  overbooked() {
    this.overbookedQuery.push('circulation.overbooked:true');
    return this;
  }

  currentlyOnLoan() {
    this.currentlyOnLoanQuery.push('circulation.active_loans:>0');
    return this;
  }

  withAvailableItems() {
    this.availableItemsQuery.push('circulation.has_items_for_loan:>0');
    return this;
  }

  withPendingLoans() {
    this.withPendingLoansQuery.push('circulation.pending_loans:>0');
    return this;
  }

  withKeyword(keyword) {
    if (!keyword) {
      throw TypeError('Keyword argument missing');
    }
    this.withKeywordQuery.push(`keywords.name:"${keyword.name}"`);
    return this;
  }

  withDocumentType(documentType) {
    if (!documentType) {
      throw TypeError('documentType argument missing');
    }
    this.withDocumentTypeQuery.push(`document_types:"${documentType}"`);
    return this;
  }

  withEitems() {
    this.withEitemsQuery.push('circulation.has_eitems:>0');
    return this;
  }

  withSeriesPid(seriesPid) {
    if (!seriesPid) {
      throw TypeError('Series PID argument missing');
    }
    this.withSeriesQuery.push(
      `series.series_pid:${prepareSumQuery(seriesPid)}`
    );
    return this;
  }

  sortBy(order = 'bestmatch') {
    this.sortByQuery = `&sort=${order}`;
    return this;
  }

  qs() {
    const searchCriteria = this.overbookedQuery
      .concat(
        this.currentlyOnLoanQuery,
        this.availableItemsQuery,
        this.withPendingLoansQuery,
        this.withKeywordQuery,
        this.withDocumentTypeQuery,
        this.withEitemsQuery,
        this.withSeriesQuery
      )
      .join(' AND ');
    return `${searchCriteria}${this.sortByQuery}`;
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
  delete: del,
  patch: patch,
  list: list,
  count: count,
  query: queryBuilder,
  serializer: serializer,
  url: documentURL,
};
