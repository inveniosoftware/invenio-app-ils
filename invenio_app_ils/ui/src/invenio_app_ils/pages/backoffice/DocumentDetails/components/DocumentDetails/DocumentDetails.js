import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { DocumentMetadata } from '../';
import { DocumentPendingLoans } from '../DocumentPendingLoans';
import { DocumentItems } from '../DocumentItems';

export default class DocumentDetails extends Component {
  render() {
    const { isLoading, data, hasError } = this.props;
    const errorData = hasError ? data : null;
    return (
      <Loader isLoading={isLoading}>
        <Error error={errorData}>
          <DocumentMetadata />
          <DocumentPendingLoans document={data} />
          <DocumentItems document={data} />
        </Error>
      </Loader>
    );
  }
}

DocumentDetails.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object,
  hasError: PropTypes.bool.isRequired,
};
