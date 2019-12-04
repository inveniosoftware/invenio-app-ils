import React, { Component } from 'react';
import { LoginWithOauthButton } from '@authentication/components';
import { OAUTH_PROVIDERS } from '@config';
import { FrontSiteRoutes } from '@routes/urls';
import { goTo } from '@history';
import { parseParams } from '../../../utils';

export default class LoginWithOauthProviders extends Component {
  checkIfOauthLoginResponse = params => {
    const isOauthResponse = 'code' in params;
    if (!isOauthResponse) return;
    if (params.code === 200) {
      this.props.clearNotifications();
      goTo(params.next_url);
    } else {
      this.props.sendErrorNotification('Login failed.', params.message);
    }
  };

  render() {
    const params = parseParams(window.location.search);
    this.checkIfOauthLoginResponse(params);

    return OAUTH_PROVIDERS.map(provider => {
      const { label, name, ...restProps } = provider;
      return (
        <LoginWithOauthButton
          key={name}
          content={label}
          name={name}
          nextUrl={params.next || FrontSiteRoutes.home}
          secondary
          {...restProps}
        />
      );
    });
  }
}
