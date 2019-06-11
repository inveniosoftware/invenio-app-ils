import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { FrontSiteRoutes } from '../../../../../routes/urls';
import { Button, Card, Divider } from 'semantic-ui-react';
import { DocumentCard } from '../DocumentCard';
import { truncate } from 'lodash/string';
import { goToHandler } from '../../../../../history';

export default class MostLoanedDocuments extends Component {
  constructor(props) {
    super(props);
    this.fetchMostLoanedDocuments = props.fetchMostLoanedDocuments;
    this.maxItemsToDisplay = props.maxDisplayedItems;
  }

  componentDidMount() {
    this.fetchMostLoanedDocuments();
  }

  prepareData(data) {
    return data.hits
      .slice(0, this.maxItemsToDisplay)
      .filter(document =>
        document.metadata.document_types.includes(this.props.filter)
      )
      .map(document => {
        return {
          pid: document.metadata.document_pid,
          title: document.metadata.title,
          authors: truncate(document.metadata.authors.join('\n')),
          imageSize: 'small',
          imageCover: 'https://assets.thalia.media/img/46276899-00-00.jpg',
          onClick: goToHandler(
            FrontSiteRoutes.documentDetailsFor(document.metadata.document_pid)
          ),
        };
      });
  }

  renderCards(items) {
    const cards = items.map(document => {
      return <DocumentCard key={document.pid} documentData={document} />;
    });

    return <Card.Group>{cards}</Card.Group>;
  }

  render() {
    const { data, isLoading, error } = this.props;
    const items = this.prepareData(data);
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <div>
            <Button
              onClick={goToHandler(
                FrontSiteRoutes.documentsListWithQuery('&sort=-mostloaned')
              )}
            >
              See All
            </Button>
            <Divider hidden />
            {this.renderCards(items)}
          </div>
        </Error>
      </Loader>
    );
  }
}

MostLoanedDocuments.propTypes = {
  fetchMostLoanedDocuments: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  filter: PropTypes.string.isRequired,
};
