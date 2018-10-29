import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Form } from 'semantic-ui-react';

export class LoanMetadata extends Component {
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
            <Form>{this.renderLoanMetadata(data)}</Form>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

LoanMetadata.propTypes = {
  data: PropTypes.object.isRequired,
};
