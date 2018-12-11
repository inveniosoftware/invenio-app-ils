import _isEmpty from 'lodash/isEmpty';
import { fromISO } from '../../../../../../common/api/date';

export function serializePendingLoan(hit) {
  const result = {};
  if (!_isEmpty(hit)) {
    result['loan_pid'] = hit.id;
    result['updated'] = fromISO(hit.updated);
    const loan = hit.metadata;
    if (!_isEmpty(loan)) {
      result['patron_pid'] = loan.patron_pid;
      result['start_date'] = loan.start_date ? fromISO(loan.start_date) : null;
      result['end_date'] = loan.end_date ? fromISO(loan.end_date) : null;
    }
  }
  return result;
}
