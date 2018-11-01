import React, { Component } from 'react';
import LoanDetails from './components/LoanDetails/LoanDetails';

export default class LoanDetailsContainer extends Component {
  constructor(props) {
    super(props);
    this.fetchLoanDetails = this.props.fetchLoanDetails;
    this.postLoanAction = this.props.postLoanAction;
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      if (location.state && location.state.loanid) {
        this.fetchLoanDetails(location.state.loanId);
      }
    });
    this.fetchLoanDetails(this.props.match.params.loanId);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    return <LoanDetails {...this.props} />;
  }
}
