import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { FrontSite, BackOffice } from '@routes/components';
import { BackOfficeRoutes } from '@routes/urls';
import history from './history';
import { NotFound } from '@components';
import { AuthenticationGuard, UnAuthorized } from './authentication/components';
import PropTypes from 'prop-types';

export default class App extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <AuthenticationGuard
            path={`${BackOfficeRoutes.home}`}
            authorizedComponent={BackOffice}
            unAuthorizedComponent={UnAuthorized}
            roles={['admin', 'librarian']}
          />
          <FrontSite {...this.props} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

App.propTypes = {
  headline: PropTypes.func,
  headlineImage: PropTypes.string,
  sections: PropTypes.array,
};
