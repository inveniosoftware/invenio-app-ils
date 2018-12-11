import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Form } from 'semantic-ui-react';

export default class LoanMetadata extends Component {
  renderLoanMetadata(loanDetails) {
    return Object.keys(loanDetails).map(key => {
      return (
        <Form.Field key={key} data-test="loan-field">
          <label className="field-name">{key}</label>
          <p>{loanDetails[key]}</p>
        </Form.Field>
      );
    });
  }

  render() {
    const loanDetails = this.props.loanDetails.metadata;
    return (
      <Segment>
        <Grid>
          <Grid.Column>
            <h1>Loan - {loanDetails.loan_pid}</h1>
            <Form>{this.renderLoanMetadata(loanDetails)}</Form>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

LoanMetadata.propTypes = {
  loanDetails: PropTypes.object.isRequired,
};
