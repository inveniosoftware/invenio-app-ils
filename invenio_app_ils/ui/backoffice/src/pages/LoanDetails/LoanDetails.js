import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Loader, Grid, List } from 'semantic-ui-react';
import { LoanMetadata } from './components/LoanMetadata';
import { LoanActions } from './components/LoanActions';
import './LoanDetails.scss';

class LoanDetails extends Component {
  constructor(props) {
    super(props);
    this.fetchLoanDetails = this.props.fetchLoanDetails.bind(this);
    this.postLoanAction = this.props.postLoanAction.bind(this);
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
        <div>Something went wrong! Got server response: {error.message}</div>
      );
    }
    return (
      <Grid>
        <Grid.Column>
          <List>
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
          </List>
        </Grid.Column>
      </Grid>
    );
  }
}

export default withRouter(LoanDetails);
