import _isEmpty from 'lodash/isEmpty';
import { fromISO } from '../date';

function serializeResponse(hit) {
  let result = {};
  if (!_isEmpty(hit)) {
    result['id'] = hit.id;
    result['created'] = fromISO(hit.created);
    result['updated'] = fromISO(hit.updated);
    if (hit.links) {
      result['links'] = hit.links;
    }
    if (!_isEmpty(hit.metadata)) {
      result['metadata'] = hit.metadata;
      result['document_pid'] = hit.metadata.document_pid;
    }
  }
  return result;
}

export const serializer = {
  fromJSON: serializeResponse,
};
