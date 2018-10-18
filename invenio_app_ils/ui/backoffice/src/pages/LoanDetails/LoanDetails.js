import React, { Component } from 'react';
import { Loader, Grid, Message } from 'semantic-ui-react';
import { LoanMetadata } from './components/LoanMetadata';
import { LoanActions } from './components/LoanActions';

class LoanDetails extends Component {
  constructor(props) {
    super(props);
    this.fetchLoanDetails = this.props.fetchLoanDetails;
    this.postLoanAction = this.props.postLoanAction;
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      if (location.state && location.state.recid) {
        this.fetchLoanDetails(location.state.recid);
      }
    });
    this.fetchLoanDetails(this.props.match.params.recid);
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
      console.error(data);
      return (
        <Message
          icon="exclamation"
          header="Oups, something went horribly wrong!"
          content={error.message}
        />
      );
    }
    return (
      <Grid centered>
        <Grid.Row>
          <LoanMetadata data={data} />
        </Grid.Row>
        <Grid.Row>
          <LoanActions
            data={data.metadata}
            actions={data.availableActions}
            actionLoading={actionLoading}
            onAction={this.postLoanAction}
          />
        </Grid.Row>
      </Grid>
    );
  }
}

export default LoanDetails;
