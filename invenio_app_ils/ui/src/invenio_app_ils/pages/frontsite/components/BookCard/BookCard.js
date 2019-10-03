import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Image, Label } from 'semantic-ui-react';
import { FrontSiteRoutes } from '../../../../routes/urls';
import { CARD_IMAGE_SIZE, getCover } from '../../config';
import { goTo } from '../../../../history';

export class BookCard extends Component {
  renderLabels = meta => {
    // meta.circulation.has_items_for_loan > 0 ? true : false
    return (
      <>
        {meta.circulation.has_items_for_loan > 0 ? (
          <Label
            attached="bottom left"
            icon="check"
            title="The book is currently avaialble"
          />
        ) : null}
        {meta.eitems.total > 0 ? (
          <Label
            attached="bottom right"
            icon="edge"
            title="An electronic version of the book is avaialble"
          />
        ) : null}
      </>
    );
  };

  render() {
    const { data } = this.props;
    return (
      <Card
        link
        centered
        onClick={() =>
          goTo(FrontSiteRoutes.documentDetailsFor(data.metadata.pid))
        }
        data-test={data.metadata.pid}
      >
        {this.renderLabels(data.metadata)}
        <Image
          centered
          size={CARD_IMAGE_SIZE}
          src={getCover(data.metadata.pid)}
          onError={e => (e.target.style.display = 'none')}
        />
        <Card.Content>
          <Card.Header>{data.metadata.title}</Card.Header>
          <Card.Meta>
            {data.metadata.authors.map(author => author.full_name)}
          </Card.Meta>
        </Card.Content>
      </Card>
    );
  }
}

BookCard.propTypes = {
  data: PropTypes.object.isRequired,
};
