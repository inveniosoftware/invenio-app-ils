import isEmpty from 'lodash/isEmpty';
import { fromISO } from '../date';

export function serializeInternalLocationResponse(hit) {
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
      result['pid'] = hit.metadata.pid;
    }
  }
  return result;
}

export function serializeLocationResponse(hit) {
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
      result['pid'] = hit.metadata.pid;
    }
  }
  return result;
}

export const internalLocationSerializer = {
  fromJSON: serializeInternalLocationResponse,
};

export const locationSerializer = {
  fromJSON: serializeLocationResponse,
};
