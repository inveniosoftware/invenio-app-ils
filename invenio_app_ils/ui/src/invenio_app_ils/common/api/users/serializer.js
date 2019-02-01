import _isEmpty from 'lodash/isEmpty';

export function serializeResponse(hit) {
  const result = {};
  if (!_isEmpty(hit)) {
    result['user_pid'] = hit.id;
    result['links'] = hit.links;
    result['email'] = hit.email;
    result['active'] = hit.active;
  }
  return result;
}

export const serializer = {
  fromJSON: serializeResponse,
};
