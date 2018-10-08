import React, { Component } from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import LoanDetails from './pages/LoanDetails';
import NotFound from './components/NotFound/NotFound';

import './App.scss';

export default class App extends Component {
  render() {
    return (
      <Router basename="/backoffice">
        <div className="app">
          <div className="app-content">
            <Switch>
              <Route path="/loans/:recid" component={LoanDetails} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}
