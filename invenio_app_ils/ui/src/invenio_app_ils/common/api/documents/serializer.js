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
  return {
    ID: document.document_pid,
    Title: document.title,
    'Loan requests': document.circulation.pending_loans,
    'Loanable items': document.circulation.loanable_items,
  };
}

export const serializer = {
  fromJSON: serializeResponse,
  toTableView: toTableView,
};
