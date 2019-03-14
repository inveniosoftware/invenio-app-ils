import _isEmpty from 'lodash/isEmpty';
import { fromISO } from '../date';

export function serializeResponse(hit) {
  const result = { ...hit.metadata };
  if (!_isEmpty(hit)) {
    result['item_pid'] = hit.metadata.item_pid;
    result['created'] = fromISO(hit.created);
    result['updated'] = fromISO(hit.updated);
  }
  const item = hit.metadata;
  if (!_isEmpty(item)) {
    result['location'] = item.internal_location.hasOwnProperty('location')
      ? item.internal_location.location.name
      : '';
    result['circulation_restriction'] = item.circulation_restriction
      ? item.circulation_restriction
      : '';
    result['legacy_id'] = item.legacy_id ? item.legacy_id : '';
    result['internal_location'] = item.internal_location.name;
    result['description'] = item.description ? item.description : '';
    result['circulation_status'] = item.circulation_status
      ? item.circulation_status.state
      : '';
  }
  return result;
}

export const serializer = {
  fromJSON: serializeResponse,
};
