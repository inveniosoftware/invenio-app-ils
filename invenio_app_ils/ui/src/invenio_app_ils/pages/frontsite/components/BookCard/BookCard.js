import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Image, Label } from 'semantic-ui-react';
import { FrontSiteRoutes } from '../../../../routes/urls';
import { getCover } from '../../config';
import { goTo } from '../../../../history';
import { DocumentAuthors } from '../../Documents/DocumentsDetails/DocumentMetadata/components';

export class BookCard extends Component {
  renderLabels = meta => {
    return (
      <>
        {meta.circulation.has_items_for_loan > 0 && <Label>On shelf</Label>}
        {meta.eitems.total > 0 && <Label>E-book</Label>}
      </>
    );
  };

  render() {
    const { data } = this.props;
    return (
      <Card
        link
        centered
        className={'fs-book-card'}
        onClick={() =>
          goTo(FrontSiteRoutes.documentDetailsFor(data.metadata.pid))
        }
        data-test={data.metadata.pid}
      >
        <Image
          centered
          src={getCover(data.metadata.pid)}
          size={'small'}
          onError={e => (e.target.style.display = 'none')}
        />
        <Card.Content centered={'true'}>
          <Card.Header>{data.metadata.title}</Card.Header>
          <Card.Meta>
            <DocumentAuthors metadata={data.metadata} />
          </Card.Meta>
          {this.renderLabels(data.metadata)}
        </Card.Content>
      </Card>
    );
  }
}

BookCard.propTypes = {
  data: PropTypes.object.isRequired,
};
