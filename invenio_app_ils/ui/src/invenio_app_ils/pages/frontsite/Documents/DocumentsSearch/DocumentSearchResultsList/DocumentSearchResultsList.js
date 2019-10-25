import React, { Component } from 'react';

import { Item } from 'semantic-ui-react';
import { DocumentListEntry } from '../DocumentListEntry';
import { ResultsList } from 'react-searchkit';

export default class DocumentSearchResultsList extends Component {
  renderResultsList = results => {
    return results.length ? (
      <Item.Group>
        {results.map(book => (
          <DocumentListEntry
            key={book.metadata.pid}
            data-test={book.metadata.pid}
            metadata={book.metadata}
          />
        ))}
      </Item.Group>
    ) : null;
  };

  render() {
    return <ResultsList renderElement={this.renderResultsList} />;
  }
}
