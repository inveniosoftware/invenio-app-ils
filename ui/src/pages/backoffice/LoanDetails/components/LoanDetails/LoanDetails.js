import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { Loader, Error } from '../../../../../common/components';
import { LoanMetadata } from '../';

export default class LoanDetails extends Component {
  render() {
    const { isLoading, error } = this.props;
    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <Container>
            <LoanMetadata />
          </Container>
        </Error>
      </Loader>
    );
  }
}

LoanDetails.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object,
  hasError: PropTypes.bool.isRequired,
  error: PropTypes.object,
};
