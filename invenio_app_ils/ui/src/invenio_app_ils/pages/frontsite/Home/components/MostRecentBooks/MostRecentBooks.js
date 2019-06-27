import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { FrontSiteRoutes } from '../../../../../routes/urls';
import { Card, Button, Divider } from 'semantic-ui-react';
import { BookCard } from '../BookCard';
import { truncate } from 'lodash/string';
import { goToHandler } from '../../../../../history';

export default class MostRecentBooks extends Component {
  constructor(props) {
    super(props);
    this.fetchMostRecentBooks = props.fetchMostRecentBooks;
    this.maxItemsToDisplay = props.maxDisplayedItems;
  }

  componentDidMount() {
    this.fetchMostRecentBooks();
  }

  prepareData(data) {
    return data.hits.slice(0, this.maxItemsToDisplay).map(document => {
      return {
        pid: document.metadata.document_pid,
        title: document.metadata.title,
        authors: truncate(document.metadata.authors.join('\n')),
        imageSize: 'small',
        imageCover: 'https://assets.thalia.media/img/46276899-00-00.jpg',
        eitems: document.metadata._computed.eitems,
        onClick: goToHandler(
          FrontSiteRoutes.documentDetailsFor(document.metadata.document_pid)
        ),
      };
    });
  }

  renderCards(books) {
    const cards = books.map(books => {
      return <BookCard key={books.pid} bookData={books} />;
    });

    return <Card.Group>{cards}</Card.Group>;
  }

  render() {
    const { data, isLoading, error } = this.props;
    const documents = this.prepareData(data);
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <div>
            <Button
              content="See All"
              onClick={goToHandler(
                FrontSiteRoutes.documentsListWithQuery(
                  '&sort=mostrecent&order=desc'
                )
              )}
            />
            <Divider hidden />
            {this.renderCards(documents)}
          </div>
        </Error>
      </Loader>
    );
  }
}

MostRecentBooks.propTypes = {
  fetchMostRecentBooks: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};
