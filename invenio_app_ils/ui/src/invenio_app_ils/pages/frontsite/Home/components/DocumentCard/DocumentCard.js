import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Card, Image } from 'semantic-ui-react';

export default class DocumentCard extends Component {
  render() {
    const documentData = this.props.documentData;
    return (
      <Card onClick={documentData.onClick}>
        <Image size={documentData.imageSize} src={documentData.imageCover} />
        <Card.Content>
          <Card.Header>{documentData.title}</Card.Header>
          <Card.Meta>{documentData.authors}</Card.Meta>
        </Card.Content>
      </Card>
    );
  }
}

DocumentCard.propTypes = {
  documentData: PropTypes.object.isRequired,
};
