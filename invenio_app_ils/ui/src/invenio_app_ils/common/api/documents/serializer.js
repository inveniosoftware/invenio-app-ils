import _isEmpty from 'lodash/isEmpty';
import { fromISO } from '../date';

function serializeResponse(hit) {
  const result = { ...hit.metadata };
  if (!_isEmpty(hit)) {
    result['document_pid'] = hit.id;
    result['created'] = fromISO(hit.created);
    result['updated'] = fromISO(hit.updated);
    result['links'] = hit.links;
  }
  return result;
}

function toTableView(document) {
  const serialized = {
    ID: document.document_pid,
    Title: document.title,
  };
  if (document.circulation) {
    serialized['Loan requests'] = document.circulation.pending_loans;
    serialized['Loanable items'] = document.circulation.loanable_items;
  }
  return serialized;
}

export const serializer = {
  fromJSON: serializeResponse,
  toTableView: toTableView,
};
