import React, { Component } from 'react';
import { LoanMetadata } from './components/LoanMetadata/LoanMetadata';
import { LoanActions } from './components/LoanActions/LoanActions';

export default class LoanDetails extends Component {
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
    return (
      <section>
        <LoanMetadata {...this.props} />
        <LoanActions {...this.props} onAction={this.postLoanAction} />
      </section>
    );
  }
}
