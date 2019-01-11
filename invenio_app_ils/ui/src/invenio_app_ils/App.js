import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { BackOfficeURLS } from './common/urls';
import {
  FrontSite as FrontSiteRoutes,
  BackOffice as BackOfficeRoutes,
} from './routes';
import history from './history';
import { NotFound } from './common/components';

export default class App extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={FrontSiteRoutes} />
          <Route path={`${BackOfficeURLS.home}`} component={BackOfficeRoutes} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}
