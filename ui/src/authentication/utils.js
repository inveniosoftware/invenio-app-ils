import Qs from 'qs';
import _isNaN from 'lodash/isNaN';
import _isNil from 'lodash/isNil';

const _sanitizeParamValue = value => {
  let parsedValue = parseInt(value);
  if (_isNaN(parsedValue)) {
    try {
      const _value = JSON.parse(value);
      if (!_isNil(_value)) {
        parsedValue = _value;
      }
    } catch (e) {
      if (value !== undefined) {
        parsedValue = value;
      } else {
        console.error(`Cannot parse value ${value}.`);
      }
    }
  }
  return parsedValue;
};

export const parseParams = (queryString = '') => {
  const parsedParams = Qs.parse(queryString, { ignoreQueryPrefix: true });
  const params = {};
  Object.entries(parsedParams).forEach(entry => {
    const key = entry[0];
    const value = entry[1];
    params[key] = _sanitizeParamValue(value);
  });
  return params;
};
