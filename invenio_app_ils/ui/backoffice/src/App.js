import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { Sidebar, NotFound } from 'common/components';
import { URLS } from 'common/urls';
import { ItemLayout, LoanLayout } from 'layouts';
import { Backoffice } from './pages';

export default class App extends Component {
  render() {
    return (
      <BrowserRouter basename={URLS.basename}>
        <Grid columns={2} relaxed>
          <Grid.Column width={3}>
            <Sidebar />
          </Grid.Column>
          <Grid.Column width={12}>
            <Switch>
              <Route path={URLS.itemList} component={ItemLayout} />
              <Route path={URLS.loanList} component={LoanLayout} />
              <Route path={URLS.root} exact component={Backoffice} />
              <Route component={NotFound} />
            </Switch>
          </Grid.Column>
        </Grid>
      </BrowserRouter>
    );
  }
}
