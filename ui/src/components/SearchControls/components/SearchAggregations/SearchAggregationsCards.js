import { BucketAggregation } from 'react-searchkit';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Label, List } from 'semantic-ui-react';
import { getSearchConfig } from '../../../../config';

/**
 * Component wrapping BucketAggregation to provide custom display for
 * filter values
 *
 * if searchConfig provides property 'labels' for the filter
 * it will display the label mapped for current bucket key
 */
export default class SearchAggregationsCards extends Component {
  searchConfig = getSearchConfig(this.props.modelName);

   _renderValueElement = (
      bucket,
      isSelected,
      onFilterClicked,
      getChildAggCmps
    ) => {
      const childAggCmps = getChildAggCmps(bucket);
      const key = bucket.key_as_string ? bucket.key_as_string : bucket.key;
      return (
        <List.Item key={bucket.key}>
          <List.Content floated="right">
            <Label>{bucket.doc_count}</Label>
          </List.Content>
          <List.Content>
            <Checkbox
              label={key}
              value={key}
              onClick={() => onFilterClicked(key)}
              checked={this._isSelected}
            />
            {childAggCmps}
          </List.Content>
        </List.Item>
      );
    };

  render() {
    if (this.searchConfig.FILTERS.length <= 0) {
      return <p>No filters available for this search.</p>;
    }
    return this.searchConfig.FILTERS.map(filter => {
      return (
        <BucketAggregation
          key={filter.field}
          title={filter.title}
          agg={{ field: filter.field, aggName: filter.aggName }}
          renderValueElement={this._renderValueElement}
        />
      );
    });
  }
}

SearchAggregationsCards.propTypes = {
  modelName: PropTypes.string.isRequired,
};
