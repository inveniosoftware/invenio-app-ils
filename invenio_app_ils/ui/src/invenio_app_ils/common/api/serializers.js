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
