import React, { Component } from 'react';
import { compose } from 'redux';
import { withError, withLoader } from 'common/hoc';
import { LoanMetadata } from '../LoanMetadata/LoanMetadata';
import { LoanActions } from '../LoanActions/LoanActions';

class LoanDetails extends Component {
  render() {
    return (
      <section>
        <LoanMetadata {...this.props} />
        <LoanActions {...this.props} onAction={this.props.postLoanAction} />
      </section>
    );
  }
}

export default compose(
  withLoader,
  withError
)(LoanDetails);
