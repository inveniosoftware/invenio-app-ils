import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { Backoffice } from './pages/Backoffice';
import { Sidebar } from './common/components';
import { NotFound } from './common/components';
import { ItemLayout } from './layouts';
import { LoanLayout } from './layouts';

export default class App extends Component {
  render() {
    return (
      <BrowserRouter basename="/backoffice">
        <Grid>
          <Grid.Column width={3}>
            <Sidebar />
          </Grid.Column>
          <Grid.Column width={12}>
            <Switch>
              <Route path="/items" component={ItemLayout} />
              <Route path="/loans" component={LoanLayout} />
              <Route path="/" exact component={Backoffice} />
              <Route component={NotFound} />
            </Switch>
          </Grid.Column>
        </Grid>
      </BrowserRouter>
    );
  }
}
