import { Dropdown } from 'semantic-ui-react';
import { BucketAggregation } from 'react-searchkit';
import React, { Component } from 'react';
import { getSearchConfig } from '../../../../config';

export default class SearchAggregationsCards extends Component {
  searchConfig = getSearchConfig('documents');

  renderValues = (title, containerCmp) => {
    return containerCmp ? (
      <>
        <Dropdown.Header content={title} />
        <Dropdown.Item>{containerCmp}</Dropdown.Item>
      </>
    ) : null;
  };

  render() {
    return this.searchConfig.FILTERS.map(filter => (
      <BucketAggregation
        key={filter.field}
        title={filter.title}
        agg={{ field: filter.field, aggName: filter.aggName }}
        renderElement={this.renderValues}
      />
    ));
  }
}
