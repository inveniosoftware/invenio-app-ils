import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { DocumentMetadata } from '../';

export default class DocumentsDetails extends Component {
  render() {
    const { isLoading, error } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <DocumentMetadata />
        </Error>
      </Loader>
    );
  }
}

DocumentsDetails.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object,
  hasError: PropTypes.bool.isRequired,
  error: PropTypes.object,
};
