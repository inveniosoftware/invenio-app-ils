import Qs from 'qs';
import _extend from 'lodash/extend';
import isEmpty from 'lodash/isEmpty';

/**
 * InvenioRequestSerializer from react-searchkit
 *
 * This implementation uses normal methods instead of methods with * arrow
 * functions to allow inheritance.
 *
 * TODO: Remove this once https://github.com/inveniosoftware/react-searchkit/issues/90
 * has been fixed.
 */
export class InvenioRequestSerializer {
  constructor() {
    this._addFilter = this._addFilter.bind(this);
    this._addFilters = this._addFilters.bind(this);
    this.serialize = this.serialize.bind(this);
  }

  _addFilter(filter, filterUrlParams) {
    if (!Array.isArray(filter)) {
      throw new Error(
        `Filter value "${filter}" in query state must be an array.`
      );
    }
    if (!(filter.length === 2 || filter.length === 3)) {
      throw new Error(
        `Filter value "${filter}" in query state must be an array of 2 or 3 elements`
      );
    }
    const aggName = filter[0];
    const fieldValue = filter[1];
    filterUrlParams[aggName] = fieldValue;
    const hasChild = filter.length === 3;
    if (hasChild) {
      this._addFilter(filter[2], filterUrlParams);
    }
  }

  _addFilters(filters) {
    if (!Array.isArray(filters)) {
      throw new Error(`Filters query state "${filters}" must be an array.`);
    }
    /**
     * input: [
     *   [ 'type_agg', 'value1' ]
     *   [ 'type_agg', 'value2', [ 'subtype_agg', 'a value' ] ]
     * ]
     */
    const filterUrlParams = {};
    filters.forEach(filter => {
      this._addFilter(filter, filterUrlParams);
    });
    /**
     * output: {
     *  type_agg: 'value1'.
     *  subtype_agg: 'a value'
     * }
     */
    return filterUrlParams;
  }

  /**
   * Return a serialized version of the app state `query` for the API backend.
   * @param {object} stateQuery the `query` state to serialize
   */
  serialize(stateQuery) {
    const { queryString, sortBy, sortOrder, page, size, filters } = stateQuery;

    const getParams = {};
    if (queryString !== null) {
      getParams['q'] = queryString;
    }
    if (sortBy !== null) {
      getParams['sort'] = sortBy;

      if (sortOrder !== null) {
        getParams['sort'] = sortOrder === 'desc' ? `-${sortBy}` : sortBy;
      }
    }
    if (page > 0) {
      getParams['page'] = page;
    }
    if (size > 0) {
      getParams['size'] = size;
    }
    const filterParams = this._addFilters(filters);
    _extend(getParams, filterParams);

    return Qs.stringify(getParams, { arrayFormat: 'repeat' });
  }
}

export const literatureRequestSerializerCls = metadata => {
  return class LiteratureRequestSerializer extends InvenioRequestSerializer {
    serialize(stateQuery) {
      const relationQuery = `relations.serial.pid:${metadata.pid}`;
      if (isEmpty(stateQuery.queryString)) {
        stateQuery.queryString = relationQuery;
      } else {
        stateQuery.queryString = `${relationQuery} AND (${stateQuery.queryString})`;
      }
      const query = `${super.serialize(stateQuery)}&include_all`;
      return query;
    }
  };
};
