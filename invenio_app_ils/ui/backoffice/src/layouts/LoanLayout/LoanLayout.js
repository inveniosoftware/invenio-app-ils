import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { LoanListContainer, LoanDetailsContainer } from 'pages';

export class LoanLayout extends Component {
  render() {
    let { match } = this.props;
    return (
      <Switch>
        <Route path={match.path} exact component={LoanListContainer} />
        <Route
          path={`${match.path}/:loanId`}
          component={LoanDetailsContainer}
        />
      </Switch>
    );
  }
}
