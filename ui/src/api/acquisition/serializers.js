import isEmpty from 'lodash/isEmpty';
import _hasIn from 'lodash/hasIn';
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
        received_date,
        expected_delivery_date,
        order_date,
      } = hit.metadata;
      result.metadata = hit.metadata;
      result.metadata.order_date = order_date ? fromISO(order_date) : null;
      if (_hasIn(hit, 'metadata.received_date')) {
        result.metadata.received_date = fromISO(received_date);
      }
      if (_hasIn(hit, 'metadata.expected_delivery_date')) {
        result.metadata.expected_delivery_date = fromISO(
          expected_delivery_date
        );
      }
      if (_hasIn(hit, 'metadata.payment.debit_date')) {
        result.metadata.payment.debit_date = fromISO(
          hit.metadata.payment.debit_date
        );
      }
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
