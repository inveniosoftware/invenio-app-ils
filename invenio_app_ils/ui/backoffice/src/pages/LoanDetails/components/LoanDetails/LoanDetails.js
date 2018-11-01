import React, { Component } from 'react';
import { compose } from 'redux';
import { Container } from 'semantic-ui-react';
import { withError, withLoader } from 'common/hoc';
import { LoanMetadata } from '../LoanMetadata/LoanMetadata';
import { LoanActions } from '../LoanActions/LoanActions';

class LoanDetails extends Component {
  render() {
    return (
      <Container>
        <LoanMetadata {...this.props} />
        <LoanActions {...this.props} onAction={this.props.postLoanAction} />
      </Container>
    );
  }
}

export default compose(
  withLoader,
  withError
)(LoanDetails);
