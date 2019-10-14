import { Accordion, Dropdown, Menu, Responsive } from 'semantic-ui-react';
import { Aggregator } from 'react-searchkit';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getSearchConfig } from '../../../../config';

export default class SearchAggregationsCards extends Component {
  state = { activeIndex: 0 };

  searchConfig = getSearchConfig('documents');

  constructor(props) {
    super(props);
  }

  toggleAccordion = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  };

  renderAccordionAggregations = (
    title,
    resultsAggregations,
    aggregations,
    customProps
  ) => {
    const { activeIndex } = this.state;

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
