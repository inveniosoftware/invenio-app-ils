import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { BookMetadata } from '../';

export default class BookDetails extends Component {
  constructor(props) {
    super(props);
    this.displayWidth = 768;
  }
  render() {
    const { isLoading, data, hasError } = this.props;
    const errorData = hasError ? data : null;
    return (
      <Loader isLoading={isLoading}>
        <Error error={errorData}>
          <BookMetadata displayWidth={this.displayWidth} />
        </Error>
      </Loader>
    );
  }
}

BookDetails.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object,
  hasError: PropTypes.bool.isRequired,
};
