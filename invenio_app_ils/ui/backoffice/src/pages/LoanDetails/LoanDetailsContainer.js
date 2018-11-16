import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { LoanDetails } from './components';

export default class LoanDetailsContainer extends Component {
  constructor(props) {
    super(props);
    this.fetchLoanDetails = this.props.fetchLoanDetails;
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen(location => {
      if (location.state && location.state.loanPid) {
        this.fetchLoanDetails(location.state.loanPid);
      }
    });
    this.fetchLoanDetails(this.props.match.params.loanPid);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    return (
      <Container>
        <LoanDetails />
      </Container>
    );
  }
}

LoanDetailsContainer.propTypes = {
  fetchLoanDetails: PropTypes.func.isRequired,
};
