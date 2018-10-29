import React, { Component } from 'react';
import { Icon, Button, Container } from 'semantic-ui-react';

import './LoanTitle.scss';

export class LoanTitle extends Component {
  render() {
    let { loanId } = this.props;
    return (
      <Container className="loan-title">
        <h1>
          Loan
          <small>
            &nbsp;
            {loanId}
            <Button primary floated="right" size="small">
              <Icon name="edit" />
              &nbsp;edit
            </Button>
          </small>
        </h1>
      </Container>
    );
  }
}
