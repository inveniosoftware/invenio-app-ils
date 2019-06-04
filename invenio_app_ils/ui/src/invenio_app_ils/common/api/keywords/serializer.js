import _isEmpty from 'lodash/isEmpty';
import { fromISO } from '../date';

function serializeResponse(hit) {
  let result = {};
  if (!_isEmpty(hit)) {
    result['id'] = hit.id;
    result['created'] = fromISO(hit.created);
    result['updated'] = fromISO(hit.updated);
    if (!_isEmpty(hit.metadata)) {
      result['metadata'] = hit.metadata;
      result['keyword_pid'] = hit.metadata.keyword_pid;
    }
  }
  return result;
}

export const serializer = {
  fromJSON: serializeResponse,
};
