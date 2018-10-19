import React, { Component } from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Backoffice } from './pages/Backoffice';
import { LoanDetails } from './pages/LoanDetails';
import { ItemDetails } from './pages/ItemDetails';
import { NotFound } from './common/components/NotFound';

import './App.scss';

export default class App extends Component {
  render() {
    return (
      <Router>
        <div className="app">
          <div className="app-content">
            <Switch>
              <Route path="/backoffice" component={Backoffice} />
              <Route path="/backoffice/loans/:recid" component={LoanDetails} />
              <Route path="/backoffice/items/:recid" component={ItemDetails} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}
