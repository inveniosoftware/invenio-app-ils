import { isEmpty } from 'lodash';

export function serializeResponse(hit) {
  const result = {};
  if (!isEmpty(hit)) {
    result['user_pid'] = hit.id.toString();
    result['links'] = hit.links;
    result['email'] = hit.email;
    result['active'] = hit.active;
    if (!isEmpty(hit.metadata)) {
      result['metadata'] = hit.metadata;
    }
  }
  return result;
}

export const serializer = {
  fromJSON: serializeResponse,
};
