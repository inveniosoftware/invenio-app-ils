import isEmpty from 'lodash/isEmpty';
import { fromISO } from '../date';

export function serializeResponse(hit) {
  let result = {};
  if (!isEmpty(hit)) {
    result['id'] = hit.id;
    result['created'] = fromISO(hit.created);
    result['updated'] = fromISO(hit.updated);
    if (hit.links) {
      result['links'] = hit.links;
    }
    if (!isEmpty(hit.metadata)) {
      result['metadata'] = hit.metadata;
      result['eitem_pid'] = hit.metadata.eitem_pid;
    }
  }
  return result;
}

export const serializer = {
  fromJSON: serializeResponse,
};
