import _isEmpty from 'lodash/isEmpty';
import { fromISO } from '../date';

function serializeResponse(hit) {
  const result = { ...hit.metadata };
  if (!_isEmpty(hit)) {
    result['loan_pid'] = hit.id;
    result['updated'] = fromISO(hit.updated);
    result['created'] = fromISO(hit.created);
    result['availableActions'] = hit.links ? hit.links.actions : {};
    const loan = hit.metadata;
    if (!_isEmpty(loan)) {
      result['item_pid'] = loan.item_pid ? loan.item_pid : '';
      if (!_isEmpty(loan.item)) {
        result['item'] = loan.item;
      }
    }
  }
  return result;
}

export const serializer = {
  fromJSON: serializeResponse,
};
