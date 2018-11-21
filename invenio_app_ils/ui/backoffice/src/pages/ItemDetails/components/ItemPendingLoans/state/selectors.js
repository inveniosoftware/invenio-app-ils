import _isEmpty from 'lodash/isEmpty';
import { fromBackend } from 'common/api/date';

export function serializePendingLoan(hit) {
  const result = {};
  if (!_isEmpty(hit)) {
    result['loan_pid'] = hit.id;
    result['updated'] = fromBackend(hit.updated);
    const loan = hit.metadata;
    if (!_isEmpty(loan)) {
      result['patron_pid'] = loan.patron_pid;
      result['start_date'] = loan.start_date
        ? fromBackend(loan.start_date)
        : null;
      result['end_date'] = loan.end_date ? fromBackend(loan.end_date) : null;
    }
  }
  return result;
}
