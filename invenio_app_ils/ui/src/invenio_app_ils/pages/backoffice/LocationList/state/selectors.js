export function serializeLocationData(data) {
  let result = {};
  result['link'] = data['links']['self'];
  result['hits'] = data['hits']['hits'];
  return result;
}
