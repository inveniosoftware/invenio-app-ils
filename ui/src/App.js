import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchUserProfile } from '@authentication/state/actions';
import { Login, ConfirmEmail } from '@authentication/pages';
import { FrontSite, BackOffice } from '@routes/components';
import { AuthenticationRoutes, BackOfficeRoutes } from '@routes/urls';
import history from './history';
import { AuthenticationGuard, UnAuthorized } from '@authentication/components';
import PropTypes from 'prop-types';

class SetUserInfoComponent extends Component {
  componentDidMount() {
    this.props.fetchUserProfile();
  }

  render() {
    return this.props.children;
  }
}

const mapDispatchToProps = dispatch => ({
  fetchUserProfile: () => dispatch(fetchUserProfile()),
});

const SetUserInfo = connect(null, mapDispatchToProps)(SetUserInfoComponent);

export default class App extends Component {
  render() {
    return (
      <SetUserInfo>
        <Router history={history}>
          <Switch>
            <Route exact path={AuthenticationRoutes.login}>
              <Login />
            </Route>
            <AuthenticationGuard
              path={AuthenticationRoutes.confirmEmail}
              authorizedComponent={ConfirmEmail}
              unAuthorizedComponent={UnAuthorized}
            />
            <AuthenticationGuard
              path={BackOfficeRoutes.home}
              authorizedComponent={BackOffice}
              unAuthorizedComponent={UnAuthorized}
              roles={['admin', 'librarian']}
            />
            <FrontSite {...this.props} />
          </Switch>
        </Router>
      </SetUserInfo>
    );
  }
}

App.propTypes = {
  headline: PropTypes.func,
  headlineImage: PropTypes.string,
  sections: PropTypes.array,
};
