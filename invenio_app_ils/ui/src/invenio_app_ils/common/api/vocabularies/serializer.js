import isEmpty from 'lodash/isEmpty';

function serializeResponse(hit) {
  let result = {};
  if (!isEmpty(hit)) {
    result['id'] = hit.id;
    if (hit.links) {
      result['links'] = hit.links;
    }
    if (!isEmpty(hit.metadata)) {
      result['metadata'] = hit.metadata;
    }
  }
  return result;
}

export const serializer = {
  fromJSON: serializeResponse,
};
