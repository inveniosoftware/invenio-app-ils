import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { LoanTable } from './LoanTable/LoanTable';

export default class LoanList extends Component {
  constructor(props) {
    super(props);
    this.fetchLoanList = this.props.fetchLoanList;
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      if (location.state) {
        this.fetchLoanList();
      }
    });
    this.fetchLoanList();
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    return (
      <Container>
        <h1>Loans</h1>
        <LoanTable {...this.props} />
      </Container>
    );
  }
}

LoanList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
