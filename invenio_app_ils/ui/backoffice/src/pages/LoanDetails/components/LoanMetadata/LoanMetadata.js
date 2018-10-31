import React, { Component } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { withError, withLoader } from 'common/components';

import { Grid, Segment, Form } from 'semantic-ui-react';

export class LoanMetadataTemplate extends Component {
  renderLoanMetadata(data) {
    return Object.keys(data.metadata).map(key => {
      return (
        <Form.Field key={key} name="loan-field">
          <label className="field-name">{key}</label>
          <p>{data.metadata[key]}</p>
        </Form.Field>
      );
    });
  }

  render() {
    let { data } = this.props;
    return (
      <Segment raised className="item-metadata">
        <Grid>
          <Grid.Column>
            <h1>Loan - {data.metadata.loan_pid}</h1>
            <Form>{this.renderLoanMetadata(data)}</Form>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

LoanMetadataTemplate.propTypes = {
  data: PropTypes.object.isRequired,
};

export const LoanMetadata = compose(
  withLoader,
  withError
)(LoanMetadataTemplate);
