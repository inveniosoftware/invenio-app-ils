import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import { LoanMetadata } from '../LoanMetadata/LoanMetadata';
import { LoanActions } from '../LoanActions/LoanActions';

export class LoanDetails extends Component {
  render() {
    return (
      <Container>
        <LoanMetadata {...this.props} />
        <LoanActions {...this.props} onAction={this.props.postLoanAction} />
      </Container>
    );
  }
}
