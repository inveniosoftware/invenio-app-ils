import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { BackOfficeURLS } from './common/urls';
import {
  FrontSite as FrontSiteRoutes,
  BackOffice as BackOfficeRoutes,
} from './routes';
import { NotFound } from './common/components';

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={FrontSiteRoutes} />
          <Route path={`${BackOfficeURLS.home}`} component={BackOfficeRoutes} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}
