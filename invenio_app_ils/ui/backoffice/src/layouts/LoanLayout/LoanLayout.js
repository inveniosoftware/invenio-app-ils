import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { LoanList, LoanDetails } from 'pages';

export class LoanLayout extends Component {
  render() {
    let { match } = this.props;
    return (
      <Switch>
        <Route path={match.path} exact component={LoanList} />
        <Route path={`${match.path}/:loanId`} component={LoanDetails} />
      </Switch>
    );
  }
}
