import _get from 'lodash/get';
import _set from 'lodash/set';
import { fromISO, toISODate } from '../date';
import { recordResponseSerializer } from '../utils';

const BrwReqSeriaizers = {
  ORDER_DATE_FIELDS: [
    'expected_delivery_date',
    'extension.request_date',
    'loan_end_date',
    'payment.debit_date',
    'received_date',
    'request_date',
  ],
  responseSerializer: function(hit) {
    const result = recordResponseSerializer(hit, function(metadata) {
      BrwReqSeriaizers.ORDER_DATE_FIELDS.forEach(field => {
        const dateStr = _get(metadata, field);
        if (dateStr) {
          _set(metadata, field, fromISO(dateStr));
        }
      });
    });
    return result;
  },
  requestSerializer: function(data) {
    BrwReqSeriaizers.ORDER_DATE_FIELDS.forEach(field => {
      const dateObj = _get(data, field);
      if (dateObj) {
        _set(data, field, toISODate(dateObj));
      }
    });
    return data;
  },
};

const LibrarySerializers = {
  responseSerializer: function(hit) {
    return recordResponseSerializer(hit);
  },
};

export const brwReqSerializer = {
  fromJSON: BrwReqSeriaizers.responseSerializer,
  toJSON: BrwReqSeriaizers.requestSerializer,
};

export const librarySerializer = {
  fromJSON: LibrarySerializers.responseSerializer,
};
