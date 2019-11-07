import { BucketAggregation } from 'react-searchkit';
import React, { Component } from 'react';
import { getSearchConfig } from '../../../../config';

export default class SearchAggregationsCards extends Component {
  searchConfig = getSearchConfig('documents');

  render() {
    return this.searchConfig.FILTERS.map(filter => (
      <BucketAggregation
        key={filter.field}
        title={filter.title}
        agg={{ field: filter.field, aggName: filter.aggName }}
      />
    ));
  }
}
