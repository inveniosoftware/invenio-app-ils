import isEmpty from 'lodash/isEmpty';
import { fromISO } from '../date';

function serializeResponse(hit) {
  let result = {};
  if (!isEmpty(hit)) {
    result['id'] = hit.id;
    result['created'] = fromISO(hit.created);
    result['updated'] = fromISO(hit.updated);
    if (!isEmpty(hit.metadata)) {
      result['metadata'] = hit.metadata;
    }
  }
  return result;
}

export const serializer = {
  fromJSON: serializeResponse,
};
