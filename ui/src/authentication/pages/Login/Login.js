import React, { Component } from 'react';
import { Grid, Header, Divider, Segment } from 'semantic-ui-react';
import { Notifications } from '@components/Notifications';
import { ENABLE_LOCAL_ACCOUNT_LOGIN, ENABLE_OAUTH_LOGIN } from '@config';
import { FrontSiteRoutes } from '@routes/urls';
import { goTo } from '@history';
import { LoginWithLocalAccount } from './components';
import { parseParams } from '../../utils';
import { LoginWithOauthProviders } from './components/LoginWithOauthProviders';

class LoginPage extends Component {
  componentDidMount() {
    this.redirectIfAlreadyLoggedIn();
    this.showNotificationIfSessionExpired();
  }

  showNotificationIfSessionExpired = () => {
    const params = parseParams(window.location.search);
    if ('sessionExpired' in params) {
      this.props.sendErrorNotification(
        'Session Error',
        'You are either not signed in or your session has expired. Please login again.'
      );
    }
  };

  redirectIfAlreadyLoggedIn = () => {
    const params = parseParams(window.location.search);

    if (!this.props.isLoading && !this.props.isAnonymous) {
      if (!('sessionExpired' in params)) {
        this.props.clearNotifications();
        goTo(params.next || FrontSiteRoutes.home);
      }
    }
  };

  render() {
    return (
      <Grid
        textAlign="center"
        verticalAlign="middle"
        columns={2}
        style={{ height: '100vh', backgroundColor: '#f9f9f9' }}
      >
        <Grid.Column>
          <Segment>
            <Header as="h2" textAlign="center">
              Login to account
            </Header>
            {ENABLE_OAUTH_LOGIN && <LoginWithOauthProviders />}
            {ENABLE_LOCAL_ACCOUNT_LOGIN && (
              <>
                <Divider horizontal>Or</Divider>
                <LoginWithLocalAccount />
              </>
            )}
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

export default class Login extends Component {
  render() {
    return (
      <>
        <Notifications />
        <LoginPage {...this.props} />
      </>
    );
  }
}
