import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { UserDetailsContainer } from '../pages';

export class UserRoutes extends Component {
  render() {
    let { match } = this.props;
    return (
      <Switch>
        <Route
          path={`${match.path}/:userPid`}
          component={UserDetailsContainer}
        />
      </Switch>
    );
  }
}
