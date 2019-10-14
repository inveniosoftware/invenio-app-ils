import { Aggregator } from 'react-searchkit';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getSearchConfig } from '../../../../config';

export default class SearchAggregationsCards extends Component {
  constructor(props) {
    super(props);
  }

  searchConfig = getSearchConfig('documents');

  render() {
    return this.searchConfig.AGGREGATIONS.map(agg => (
      <Aggregator key={agg.field} title={agg.title} field={agg.field} />
    ));
  }
}
