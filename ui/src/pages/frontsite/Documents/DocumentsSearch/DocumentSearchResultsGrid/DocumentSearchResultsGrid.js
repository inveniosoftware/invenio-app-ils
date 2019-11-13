import React, { Component } from 'react';
import { BookCard } from '../../../components/BookCard';

import { Card, Responsive } from 'semantic-ui-react';
import { ResultsGrid } from 'react-searchkit';

export default class DocumentSearchResultsGrid extends Component {
  renderResultsGrid = results => {
    const cards = results.map(book => {
      return <BookCard key={book.metadata.pid} data={book} />;
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
