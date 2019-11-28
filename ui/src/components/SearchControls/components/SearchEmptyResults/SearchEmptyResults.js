import { Header, Icon, Segment } from 'semantic-ui-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EmptyResults } from 'react-searchkit';
import { ClearButton } from '../ClearButton';

export default class SearchEmptyResults extends Component {
  renderEmptyResults = (queryString, resetQuery) => {
    return (
      <Segment placeholder textAlign="center">
        <Header icon>
          <Icon name="search" />
          No results found!
        </Header>
        <div className="empty-results-current">
          Current search "{queryString}"
        </div>
        <Segment.Inline>
          <ClearButton clickHandler={resetQuery} />
          {this.props.extras ? this.props.extras() : null}
        </Segment.Inline>
      </Segment>
    );
  };

  render() {
    return <EmptyResults renderElement={this.renderEmptyResults} />;
  }
}

SearchEmptyResults.propTypes = {
  extras: PropTypes.func,
};
