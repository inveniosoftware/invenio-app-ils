import _get from 'lodash/get';
import _set from 'lodash/set';
import { fromISO, toISODate } from '../date';
import { recordResponseSerializer } from '../utils';

const OrderSerializers = {
  DATE_FIELDS: [
    'expected_delivery_date',
    'order_date',
    'payment.debit_date',
    'received_date',
  ],
  responseSerializer: function(hit) {
    const result = recordResponseSerializer(hit, function(metadata) {
      OrderSerializers.DATE_FIELDS.forEach(field => {
        const dateStr = _get(metadata, field);
        if (dateStr) {
          _set(metadata, field, fromISO(dateStr));
        }
      });
    });
    return result;
  },
  requestSerializer: function(data) {
    OrderSerializers.DATE_FIELDS.forEach(field => {
      const dateObj = _get(data, field);
      if (dateObj) {
        _set(data, field, toISODate(dateObj));
      }
    });
    return data;
  },
};

const VendorSerializers = {
  responseSerializer: function(hit) {
    return recordResponseSerializer(hit);
  },
};

export const orderSerializer = {
  fromJSON: OrderSerializers.responseSerializer,
  toJSON: OrderSerializers.requestSerializer,
};

export const vendorSerializer = {
  fromJSON: VendorSerializers.responseSerializer,
};
