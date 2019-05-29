import isEmpty from 'lodash/isEmpty';
import { fromISO } from '../date';

function serializeResponse(hit) {
  let result = {};
  if (!isEmpty(hit)) {
    result['id'] = hit.id;
    result['created'] = fromISO(hit.created);
    result['updated'] = fromISO(hit.updated);
    result['availableActions'] = hit.links ? hit.links.actions : {};

    if (hit.links) {
      result['links'] = hit.links;
    }
    if (!isEmpty(hit.metadata)) {
      result['metadata'] = hit.metadata;
      result['loan_pid'] = hit.metadata.loan_pid;
      result['metadata']['start_date'] = fromISO(hit.metadata.start_date);
      result['metadata']['end_date'] = fromISO(hit.metadata.end_date);
      result['metadata']['transaction_date'] = fromISO(
        hit.metadata.transaction_date
      );
      result['metadata']['request_expire_date'] = fromISO(
        hit.metadata.request_expire_date
      );
    }
  }

  return result;
}

export const serializer = {
  fromJSON: serializeResponse,
};
