import isEmpty from 'lodash/isEmpty';
import { fromISO } from '../date';

function serializeSeries(series) {
  return {
    serial: series.filter(s => s.mode_of_issuance === 'SERIAL'),
    multipart: series.filter(s => s.mode_of_issuance === 'MULTIPART_MONOGRAPH'),
  };
}

function serializeResponse(hit) {
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
      if (!isEmpty(hit.metadata.circulation.next_available_date)) {
        result['metadata']['circulation']['next_available_date'] = new Date(
          result['metadata']['circulation']['next_available_date']
        ).toDateString();
      }
      if (!isEmpty(hit.metadata.series)) {
        // Split the series based on mode of issuance - requested by the library
        result['metadata']['series'] = serializeSeries(hit.metadata.series);
      }
      result['document_pid'] = hit.metadata.document_pid;
    }
  }
  return result;
}

export const serializer = {
  fromJSON: serializeResponse,
};
