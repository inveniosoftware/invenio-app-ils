import _isEmpty from 'lodash/isEmpty';
import { fromISO } from '../date';

export function serializeInternalLocationResponse(hit) {
  const result = { ...hit.metadata };
  if (!_isEmpty(hit)) {
    result['internal_location_pid'] = hit.id;
    result['created'] = fromISO(hit.created);
    result['updated'] = fromISO(hit.updated);
    result['link'] = hit.links.self;
  }
  const metadata = hit.metadata;
  if (!_isEmpty(metadata)) {
    result['name'] = metadata.name;
    result['physical_location'] = metadata.physical_location;
    result['location_email'] = metadata.location.email;
    result['location_name'] = metadata.location.name;
    result['location_id'] = metadata.location_pid;
  }
  return result;
}

export function serializeLocationResponse(hit) {
  const result = { ...hit.metadata };
  if (!_isEmpty(hit)) {
    result['location_pid'] = hit.id;
    result['created'] = fromISO(hit.created);
    result['updated'] = fromISO(hit.updated);
    result['link'] = hit.links.self;
  }
  return result;
}

export const internalLocationSerializer = {
  fromJSON: serializeInternalLocationResponse,
};

export const locationSerializer = {
  fromJSON: serializeLocationResponse,
};
