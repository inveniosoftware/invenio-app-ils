import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Notifications } from '@components/Notifications';
import { ConfirmEmail, Login } from '@pages/accounts';
import { AccountsRoutes } from '@routes/urls';
import { AuthenticationGuard, UnAuthorized } from '@authentication/components';

export class Accounts extends Component {
  render() {
    return (
      <>
        <Notifications />
        <Switch>
          <Route path={AccountsRoutes.login} component={Login} />
          <AuthenticationGuard
            path={AccountsRoutes.confirmEmail}
            authorizedComponent={ConfirmEmail}
            unAuthorizedComponent={UnAuthorized}
          />
        </Switch>
      </>
    );
  }
}
