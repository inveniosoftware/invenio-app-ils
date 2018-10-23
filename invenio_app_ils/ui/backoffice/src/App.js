import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { Backoffice } from './pages/Backoffice';
import { Sidebar } from './common/components';
import { NotFound } from './common/components';
import { LoanDetails } from './pages/LoanDetails';
import { ItemDetails } from './pages/ItemDetails';

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Grid>
          <Grid.Column width={3}>
            <Sidebar />
          </Grid.Column>
          <Grid.Column width={12}>
            <Switch>
              <Route path="/backoffice/loans/:recid" component={LoanDetails} />
              <Route path="/backoffice/items/:recid" component={ItemDetails} />
              <Route path="/backoffice" component={Backoffice} />
              <Route component={NotFound} />
            </Switch>
          </Grid.Column>
        </Grid>
      </BrowserRouter>
    );
  }
}
