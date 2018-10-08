export function serializeLoanDetails(data) {
  let result = {};
  if (data.links.actions) {
    result['availableActions'] = data.links.actions;
  }
  result['metadata'] = data.metadata;
  return result;
}
