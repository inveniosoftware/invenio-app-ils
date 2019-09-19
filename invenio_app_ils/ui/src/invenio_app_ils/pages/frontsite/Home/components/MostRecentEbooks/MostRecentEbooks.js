import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Card, Divider } from 'semantic-ui-react';
import { Error, Loader } from '../../../../../common/components';
import { goToHandler } from '../../../../../history';
import { FrontSiteRoutes } from '../../../../../routes/urls';
import { EbookCard } from '../EbookCard';

export default class MostRecentEbooks extends Component {
  constructor(props) {
    super(props);
    this.fetchMostRecentEbooks = props.fetchMostRecentEbooks;
    this.maxItemsToDisplay = props.maxDisplayedItems;
  }

  componentDidMount() {
    this.fetchMostRecentEbooks();
  }

  prepareData(data) {
    const ebooks = data.hits.slice(0, this.maxItemsToDisplay).map(book => {
      return book.metadata.eitems.hits.map(ebook => {
        return {
          document_pid: book.metadata.pid,
          pid: ebook.pid,
          title: book.metadata.title.title,
          description: ebook.description,
          open_access: ebook.open_access,
          imageSize: 'small',
          imageCover: 'https://assets.thalia.media/img/46276899-00-00.jpg',
          onClick: goToHandler(
            FrontSiteRoutes.documentDetailsFor(book.metadata.pid)
          ),
        };
      });
    });
    return (
      []
        .concat(...ebooks)
        // slice again because documents could contain multiple eitems
        .slice(0, this.maxItemsToDisplay)
    );
  }

  renderCards(ebooks) {
    const cards = ebooks.map(ebook => {
      return <EbookCard key={ebook.pid} ebookData={ebook} />;
    });

    return <Card.Group>{cards}</Card.Group>;
  }

  render() {
    const { data, isLoading, error } = this.props;
    const ebooks = this.prepareData(data);
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <div>
            <Button
              content="See All"
              onClick={goToHandler(
                FrontSiteRoutes.documentsListWithQuery(
                  '&sort=mostrecent&order=desc' +
                    '&aggr[0][has_eitems][value]=has_eitems.electronic versions'
                )
              )}
            />
            <Divider hidden />
            {this.renderCards(ebooks)}
          </div>
        </Error>
      </Loader>
    );
  }
}

MostRecentEbooks.propTypes = {
  fetchMostRecentEbooks: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};
