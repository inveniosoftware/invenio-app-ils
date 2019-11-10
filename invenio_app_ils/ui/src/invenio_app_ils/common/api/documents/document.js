import { http, apiConfig } from '../base';
import { serializer } from './serializer';
import { prepareSumQuery } from '../utils';

const documentURL = '/documents/';

const get = documentPid => {
  return http.get(`${documentURL}${documentPid}`).then(response => {
    response.data = serializer.fromJSON(response.data);
    return response;
  });
};

const create = async data => {
  const resp = await http.post(`${documentURL}`, data);
  resp.data = serializer.fromJSON(resp.data);
  return resp;
};

const update = async (docPid, data) => {
  const response = await http.put(`${documentURL}${docPid}`, data);
  response.data = serializer.fromJSON(response.data);
  return response;
};

const del = async docPid => {
  return await http.delete(`${documentURL}${docPid}`);
};

const patch = async (documentPid, ops) => {
  const response = await http.patch(`${documentURL}${documentPid}`, ops, {
    headers: { 'Content-Type': 'application/json-patch+json' },
  });
  response.data = serializer.fromJSON(response.data);
  return response;
};

const viewEvent = async docPid => {
  return await http.post(`${documentURL}${docPid}/stats`, {
    event: 'record-view',
  });
};

const createRelation = async (docPid, data) => {
  const resp = await http.post(`${documentURL}${docPid}/relations`, data);
  resp.data = serializer.fromJSON(resp.data);
  return resp;
};

const deleteRelation = async (docPid, data) => {
  const resp = await http.delete(`${documentURL}${docPid}/relations`, {
    data: data,
  });
  resp.data = serializer.fromJSON(resp.data);
  return resp;
};

class QueryBuilder {
  constructor() {
    this.overbookedQuery = [];
    this.currentlyOnLoanQuery = [];
    this.availableItemsQuery = [];
    this.withPendingLoansQuery = [];
    this.withTagQuery = [];
    this.withDocumentTypeQuery = [];
    this.withEitemsQuery = [];
    this.pendingOverdueQuery = [];
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

  withTag(tag) {
    if (!tag) {
      throw TypeError('Tag argument missing');
    }
    this.withTagQuery.push(`tags.name:"${tag.name}"`);
    return this;
  }

  withDocumentType(documentType) {
    if (!documentType) {
      throw TypeError('documentType argument missing');
    }
    this.withDocumentTypeQuery.push(`document_type:"${documentType}"`);
    return this;
  }

  withEitems() {
    this.withEitemsQuery.push('eitems.total:>0');
    return this;
  }

  withSeriesPid(seriesPid, moi) {
    if (!seriesPid) {
      throw TypeError('Series PID argument missing');
    }
    if (moi === 'SERIAL') {
      this.withSeriesQuery.push(
        `relations.serial.pid:${prepareSumQuery(seriesPid)}`
      );
    } else {
      this.withSeriesQuery.push(
        `relations.multipart_monograph.pid:${prepareSumQuery(seriesPid)}`
      );
    }
    return this;
  }

  pendingOverdue() {
    const query = [
      'circulation.has_items_for_loan:0',
      'circulation.pending_loans:>0',
      'circulation.overdue_loans:>0',
      'items.total:>0',
    ];
    this.pendingOverdueQuery.push(encodeURI(query.join(' AND ')));
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
        this.withTagQuery,
        this.withDocumentTypeQuery,
        this.withEitemsQuery,
        this.pendingOverdueQuery,
        this.withSeriesQuery
      )
      .join(' AND ');
    return `${searchCriteria}${this.sortByQuery}`;
  }
}

const queryBuilder = () => {
  return new QueryBuilder();
};

const list = async query => {
  const response = await http.get(`${documentURL}?q=${query}`);
  response.data.total = response.data.hits.total;
  response.data.hits = response.data.hits.hits.map(hit =>
    serializer.fromJSON(hit)
  );
  return response;
};

const count = query => {
  return http.get(`${documentURL}?q=${query}`).then(response => {
    response.data = response.data.hits.total;
    return response;
  });
};

export const document = {
  searchBaseURL: `${apiConfig.baseURL}${documentURL}`,
  get: get,
  create: create,
  update: update,
  delete: del,
  patch: patch,
  viewEvent: viewEvent,
  createRelation: createRelation,
  deleteRelation: deleteRelation,
  list: list,
  count: count,
  query: queryBuilder,
  serializer: serializer,
};
