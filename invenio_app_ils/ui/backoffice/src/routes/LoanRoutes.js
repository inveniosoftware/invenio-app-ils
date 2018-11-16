import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { LoansSearch, LoanDetailsContainer } from 'pages';

export class LoanRoutes extends Component {
  render() {
    let { match } = this.props;
    return (
      <Switch>
        <Route path={match.path} exact component={LoansSearch} />
        <Route
          path={`${match.path}/:loanPid`}
          component={LoanDetailsContainer}
        />
      </Switch>
    );
  }
}
