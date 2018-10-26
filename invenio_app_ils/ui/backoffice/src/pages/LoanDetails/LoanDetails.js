import React, { Component } from 'react';
import { Loader, Message } from 'semantic-ui-react';
import { LoanTitle } from './components/LoanTitle/LoanTitle';
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
      if (location.state && location.state.recid) {
        this.fetchLoanDetails(location.state.loanId);
      }
    });
    this.fetchLoanDetails(this.props.match.params.loanId);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    let {
      data,
      error,
      fetchLoading,
      actionLoading,
      loanActionError,
    } = this.props;
    if (fetchLoading) return <Loader active inline="centered" />;
    if (loanActionError) {
      return (
        <Message
          icon="exclamation"
          header="Oups, something went horribly wrong!"
          content={error.message}
        />
      );
    }
    console.log(data);
    return (
      <section>
        <LoanTitle loanId={data.metadata.loan_pid} />
        <LoanMetadata data={data} />
        <LoanActions
          data={data.metadata}
          actions={data.availableActions}
          actionLoading={actionLoading}
          onAction={this.postLoanAction}
        />
      </section>
    );
  }
}
