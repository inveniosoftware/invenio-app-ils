export function serializeLoanDetails(data) {
  let result = {};
  if (data) {
    if (data.links) {
      result['availableActions'] = data.links.actions || {};
    }
    result['metadata'] = data.metadata;
  }
  return result;
}
