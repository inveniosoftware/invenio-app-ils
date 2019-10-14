import { Header, Icon, Segment } from 'semantic-ui-react';
import React, { Component } from 'react';
import { EmptyResults } from 'react-searchkit';

export default class SearchEmptyResults extends Component {
  renderEmptyResults = (queryString, resetQuery) => {
    return (
      <Segment placeholder textAlign="center">
        <Header icon>
          <Icon name="search" />
          No records found!
        </Header>
        <div className="empty-results-current">
          Current search "{queryString}"
        </div>
      </Segment>
    );
  };

  render() {
    return <EmptyResults renderElement={this.renderEmptyResults} />;
  }
}
