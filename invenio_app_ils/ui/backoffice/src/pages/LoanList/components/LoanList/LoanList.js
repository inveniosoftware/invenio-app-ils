import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { Container } from 'semantic-ui-react';
import { LoanTable } from '../LoanTable/LoanTable';
import { withLoader, withError } from 'common/hoc';

const EnchancedTable = compose(
  withError,
  withLoader,
  withRouter
)(LoanTable);

export class LoanList extends Component {
  render() {
    let { isLoading, data, error } = this.props;
    return (
      <Container fluid>
        <h1>Loans</h1>
        <EnchancedTable isLoading={isLoading} data={data} error={error} />
      </Container>
    );
  }
}

LoanList.propTypes = {
  data: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
