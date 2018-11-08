import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { compose } from 'redux';
import { withError, withLoader } from 'common/hoc';
import { LoanMetadata } from '../LoanMetadata/LoanMetadata';
import { LoanActions } from '../LoanActions/LoanActions';

class LoanDetails extends Component {
  render() {
    let { data, onAction } = this.props;
    return (
      <Container>
        <LoanMetadata data={data} />
        <LoanActions data={data} onAction={onAction} />
      </Container>
    );
  }
}

LoanDetails.propTypes = {
  data: PropTypes.object.isRequired,
};

export default compose(
  withLoader,
  withError
)(LoanDetails);
