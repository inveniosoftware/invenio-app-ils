import _isEmpty from 'lodash/isEmpty';
import { fromISO } from './date';

export function serializeLoan(hit) {
  const result = {};
  if (!_isEmpty(hit)) {
    result['loan_pid'] = hit.id;
    result['updated'] = fromISO(hit.updated);
    const loan = hit.metadata;
    if (!_isEmpty(loan)) {
      result['patron_pid'] = loan.patron_pid;
      result['item_pid'] = loan.item_pid;
      result['start_date'] = loan.start_date ? fromISO(loan.start_date) : null;
      result['end_date'] = loan.end_date ? fromISO(loan.end_date) : null;
      result['state'] = loan.state;
    }
  }
  return result;
}

export function serializeItem(hit) {
  const result = {};
  if (!_isEmpty(hit)) {
    result['item_pid'] = hit.id;
    result['created'] = fromISO(hit.created);
    result['updated'] = fromISO(hit.updated);
  }
  const item = hit.metadata;
  if (!_isEmpty(item)) {
    result['location'] = item.internal_location.name;
    result['medium'] = item.medium;
    result['status'] = item.status;
    result['shelf'] = item.shelf;
    result['barcode'] = item.barcode;
  }
  return result;
}
