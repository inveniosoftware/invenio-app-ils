import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Card, Image } from 'semantic-ui-react';

export default class EbookCard extends Component {
  render() {
    const ebookData = this.props.ebookData;
    return (
      <Card onClick={ebookData.onClick} data-test={ebookData.eitem_pid}>
        <Image size={ebookData.imageSize} src={ebookData.imageCover} />
        <Card.Content>
          <Card.Header>{ebookData.title}</Card.Header>
          <Card.Meta>{ebookData.description}</Card.Meta>
        </Card.Content>
      </Card>
    );
  }
}

EbookCard.propTypes = {
  ebookData: PropTypes.object.isRequired,
};
