import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Image, Label } from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';
import { FrontSiteRoutes } from '@routes/urls';
import { getCover } from '../../config';
import { goTo } from '@history';
import { DocumentAuthors } from '@components/Document';

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
        <Card.Meta className={'discrete'}>
          {data.metadata.document_type}
        </Card.Meta>
        <Image
          centered
          src={getCover(data.metadata.edition)}
          size={'small'}
          onError={e => (e.target.style.display = 'none')}
        />
        <Card.Content>
          <Card.Header>{data.metadata.title}</Card.Header>
          <Card.Meta>
            <DocumentAuthors metadata={data.metadata} />
            <div>
              {!isEmpty(data.metadata.imprints) ? (
                <>
                  {data.metadata.imprints[0].date} <br />{' '}
                </>
              ) : null}
              Edition {data.metadata.edition}
            </div>
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>{this.renderLabels(data.metadata)}</Card.Content>
      </Card>
    );
  }
}

BookCard.propTypes = {
  data: PropTypes.object.isRequired,
};
