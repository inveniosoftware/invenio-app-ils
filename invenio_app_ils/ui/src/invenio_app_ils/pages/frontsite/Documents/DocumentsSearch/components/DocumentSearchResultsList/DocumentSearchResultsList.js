import React, { Component } from 'react';
import { BookCard } from '../../../../components/BookCard';
import PropTypes from 'prop-types';

import { Card, Item } from 'semantic-ui-react';
import { DocumentListEntry } from '../DocumentListEntry';
import { goTo } from '../../../../../../history';
import { FrontSiteRoutes } from '../../../../../../routes/urls';
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
            rowActionClickHandler={pid =>
              goTo(FrontSiteRoutes.documentDetailsFor(pid))
            }
          />
        ))}
      </Item.Group>
    ) : null;
  };

  render() {
    return <ResultsList renderElement={this.renderResultsList} />;
  }
}
