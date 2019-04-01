import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { BackOfficeURLS } from './common/urls';
import {
  FrontSite as FrontSiteRoutes,
  BackOffice as BackOfficeRoutes,
} from './routes';
import history from './history';
import { NotFound } from './common/components';
import { AuthenticationGuard, UnAuthorized } from './authentication/components';

export default class App extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <AuthenticationGuard
            path={`${BackOfficeURLS.home}`}
            authorizedComponent={BackOfficeRoutes}
            unAuthorizedComponent={UnAuthorized}
            roles={['admin', 'librarian']}
          />
          <FrontSiteRoutes />
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}
