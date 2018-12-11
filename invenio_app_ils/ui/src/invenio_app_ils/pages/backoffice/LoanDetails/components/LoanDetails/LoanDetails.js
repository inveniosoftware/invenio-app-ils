import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { Loader, Error } from '../../../../../common/components';
import { LoanMetadata } from '../';
import { LoanActions } from '../';

export default class LoanDetails extends Component {
  render() {
    const {
      isLoading,
      isActionLoading,
      data,
      hasError,
      actionHasError,
    } = this.props;
    const errorData = hasError || actionHasError ? data : null;
    const anyIsLoading = isLoading || isActionLoading;
    return (
      <Loader isLoading={anyIsLoading}>
        <Error error={errorData}>
          <Container>
            <LoanMetadata />
            <LoanActions />
          </Container>
        </Error>
      </Loader>
    );
  }
}

LoanDetails.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isActionLoading: PropTypes.bool.isRequired,
  data: PropTypes.object,
  hasError: PropTypes.bool.isRequired,
  actionHasError: PropTypes.bool.isRequired,
};
