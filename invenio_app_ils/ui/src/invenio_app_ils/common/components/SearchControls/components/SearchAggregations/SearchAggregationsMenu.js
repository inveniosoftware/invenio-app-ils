import { Dropdown } from 'semantic-ui-react';
import { Aggregator } from 'react-searchkit';
import React, { Component } from 'react';
import { getSearchConfig } from '../../../../config';
import PropTypes from "prop-types";

export default class SearchAggregationsCards extends Component {
  searchConfig = getSearchConfig(this.props.modelName);

  renderAccordionAggregations = (title, resultsAggregations, aggregations) => {
    return resultsAggregations !== undefined ? (
      <>
        <Dropdown.Header content={title} />
        <Dropdown.Item>{aggregations}</Dropdown.Item>
      </>
    ) : null;
  };

  render() {
    return this.searchConfig.AGGREGATIONS.map((agg, idx) => (
      <Aggregator
        title={agg.title}
        field={agg.field}
        key={agg.field}
        customProps={{ index: idx }}
        renderElement={this.renderAccordionAggregations}
      />
    ));
  }
}

SearchAggregationsCards.propTypes = {
  modelName: PropTypes.string.isRequired
};
