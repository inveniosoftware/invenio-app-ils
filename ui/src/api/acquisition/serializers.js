import isEmpty from 'lodash/isEmpty';
import { fromISO } from '../date';

function serializeOrderResponse(hit) {
  let result = {};
  if (!isEmpty(hit)) {
    result.id = hit.id;
    result.created = fromISO(hit.created);
    result.updated = fromISO(hit.updated);
    if (hit.links) {
      result.links = hit.links;
    }
    if (!isEmpty(hit.metadata)) {
      const {
        delivery_date,
        expected_delivery_date,
        order_date,
      } = hit.metadata;
      result.metadata = hit.metadata;
      result.metadata.order_date = order_date ? fromISO(order_date) : null;
      result.metadata.delivery_date = delivery_date
        ? fromISO(delivery_date)
        : null;
      result.metadata.expected_delivery_date = expected_delivery_date
        ? fromISO(expected_delivery_date)
        : null;
      result.pid = hit.metadata.pid;
    }
  }
  return result;
}

function serializeVendorResponse(hit) {
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

export const vendorSerializer = {
  fromJSON: serializeVendorResponse,
};

export const orderSerializer = {
  fromJSON: serializeOrderResponse,
};
