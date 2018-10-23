import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { LoanList } from '../../pages/LoanList';
import { LoanDetails } from '../../pages/LoanDetails';

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
