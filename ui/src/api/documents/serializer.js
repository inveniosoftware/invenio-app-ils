import _get from 'lodash/get';
import _set from 'lodash/set';
import { fromISO, toISODate } from '../date';
import { recordResponseSerializer } from '../utils';

const DocumentSerializers = {
  DATE_FIELDS: ['circulation.next_available_date'],
  responseSerializer: function(hit) {
    const result = recordResponseSerializer(hit, function(metadata) {
      DocumentSerializers.DATE_FIELDS.forEach(field => {
        const dateStr = _get(metadata, field);
        if (dateStr) {
          _set(metadata, field, fromISO(dateStr));
        }
      });
    });
    return result;
  },
  requestSerializer: function(data) {
    DocumentSerializers.DATE_FIELDS.forEach(field => {
      const dateObj = _get(data, field);
      if (dateObj) {
        _set(data, field, toISODate(dateObj));
      }
    });
    return data;
  },
};

export const documentSerializer = {
  fromJSON: DocumentSerializers.responseSerializer,
  toJSON: DocumentSerializers.requestSerializer,
};
