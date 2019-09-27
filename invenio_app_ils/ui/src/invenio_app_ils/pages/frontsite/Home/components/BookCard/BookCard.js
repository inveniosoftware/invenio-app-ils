import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Card, Image } from 'semantic-ui-react';

export default class BookCard extends Component {
  render() {
    const bookData = this.props.bookData;
    return (
      <Card onClick={bookData.onClick} data-test={bookData.pid}>
        <Image size={bookData.imageSize} src={bookData.imageCover} />
        <Card.Content>
          <Card.Header>{bookData.title}</Card.Header>
          <Card.Meta>{bookData.authors}</Card.Meta>
        </Card.Content>
      </Card>
    );
  }
}

BookCard.propTypes = {
  bookData: PropTypes.object.isRequired,
};
