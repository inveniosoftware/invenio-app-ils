import React, { Component } from 'react';
import { BookCard } from '@pages/frontsite/components/BookCard';

import { Card, Responsive } from 'semantic-ui-react';
import { ResultsGrid } from 'react-searchkit';
import { SeriesCard } from '@pages/frontsite/components/Series';
import { recordToPidType } from '@api/utils';

export default class DocumentSearchResultsGrid extends Component {
  renderResultsGrid = results => {
    // TODO: Change to use the pid object's pid_type when it's been implemented
    const cards = results.map(result => {
      return recordToPidType(result) === 'docid' ? (
        <BookCard key={result.metadata.pid} data={result} />
      ) : (
        <SeriesCard key={result.metadata.pid} data={result} />
      );
    });
    return (
      <>
        <Responsive minWidth={Responsive.onlyLargeScreen.minWidth}>
          <Card.Group doubling stackable itemsPerRow={5}>
            {cards}
          </Card.Group>
        </Responsive>
        <Responsive maxWidth={Responsive.onlyLargeScreen.minWidth - 1}>
          <Card.Group doubling stackable itemsPerRow={3}>
            {cards}
          </Card.Group>
        </Responsive>
      </>
    );
  };

  render() {
    return <ResultsGrid renderElement={this.renderResultsGrid} />;
  }
}
