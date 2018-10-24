import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { Backoffice } from './pages/Backoffice';
import { Sidebar } from './common/components';
import { NotFound } from './common/components';
import { ItemLayout } from './layouts';
import { LoanLayout } from './layouts';
import { URLS } from './common/urls';

export default class App extends Component {
  render() {
    return (
      <BrowserRouter basename={URLS.BASENAME}>
        <Grid>
          <Grid.Column width={3}>
            <Sidebar />
          </Grid.Column>
          <Grid.Column width={12}>
            <Switch>
              <Route path={URLS.ITEM_LIST} component={ItemLayout} />
              <Route path={URLS.LOAN_LIST} component={LoanLayout} />
              <Route path={URLS.ROOT} exact component={Backoffice} />
              <Route component={NotFound} />
            </Switch>
          </Grid.Column>
        </Grid>
      </BrowserRouter>
    );
  }
}
