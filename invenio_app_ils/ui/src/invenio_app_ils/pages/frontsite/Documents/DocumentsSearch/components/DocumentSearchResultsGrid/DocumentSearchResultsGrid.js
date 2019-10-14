import React, { Component } from 'react';
import { BookCard } from '../../../../components/BookCard';
import PropTypes from 'prop-types';

import { Card } from 'semantic-ui-react';
import { ResultsGrid } from 'react-searchkit';

export default class DocumentSearchResultsGrid extends Component {
  renderResultsGrid = results => {
    const cards = results.map(book => {
      return <BookCard key={book.metadata.pid} data={book} />;
    });
    return (
      <Card.Group doubling stackable itemsPerRow={5}>
        {cards}
      </Card.Group>
    );
  };

  render() {
    return <ResultsGrid renderElement={this.renderResultsGrid} />;
  }
}
