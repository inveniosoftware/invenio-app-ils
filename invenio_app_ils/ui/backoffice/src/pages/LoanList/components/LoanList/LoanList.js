import React, { Component } from 'react';
import { compose } from 'redux';
import { withError, withLoader } from 'common/hoc';
import { Container } from 'semantic-ui-react';
import { LoanTable } from '../LoanTable/LoanTable';

class LoanList extends Component {
  render() {
    return (
      <Container>
        <h1>Loans</h1>
        <LoanTable {...this.props} />
      </Container>
    );
  }
}

export default compose(
  withError,
  withLoader
)(LoanList);
