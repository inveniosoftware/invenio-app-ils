import _isEmpty from 'lodash/isEmpty';

export function serializeLoanDetails(data) {
  const result = {};
  if (!_isEmpty(data)) {
    result['availableActions'] = data.links ? data.links.actions : {};
    result['metadata'] = data.metadata;
  }
  return result;
}
