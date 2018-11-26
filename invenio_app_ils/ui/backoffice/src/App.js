import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Header, NotFound } from 'common/components';
import { URLS } from 'common/urls';
import { ItemRoutes, LoanRoutes } from 'routes';
import { Backoffice, UserDetailsContainer } from './pages';
import './App.scss';

export default class App extends Component {
  render() {
    return (
      <BrowserRouter basename={URLS.basename}>
        <div>
          <Header />
          <div className="container">
            <Switch>
              <Route path={URLS.itemsSearch} component={ItemRoutes} />
              <Route path={URLS.loansSearch} component={LoanRoutes} />
              <Route
                path={URLS.patronDetails}
                component={UserDetailsContainer}
              />
              <Route path={URLS.root} exact component={Backoffice} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}
