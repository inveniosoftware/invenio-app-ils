import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  sessionManager,
  authenticationService,
} from '@authentication/services';

export class AuthenticationGuard extends Component {
  render() {
    const {
      authorizedComponent: Authorized,
      unAuthorizedComponent: UnAuthorized,
      loginComponent: LoginComponent,
      roles,
      ...restParams
    } = this.props;

    if (!sessionManager.authenticated) {
      if (LoginComponent) {
        return <LoginComponent />;
      }
      authenticationService.login(window.location.pathname);
      return null;
    }

    if (sessionManager.authenticated && !sessionManager.hasRoles(roles)) {
      if (UnAuthorized) {
        console.error(
          `User has no permission to access the page ${window.location.pathname}`
        );
        return <UnAuthorized />;
      }
      return null;
    }
    return <Authorized {...restParams} />;
  }
}

//set loginComponent prop to render conditionally depending on auth
AuthenticationGuard.propTypes = {
  authorizedComponent: PropTypes.func.isRequired,
  unAuthorizedComponent: PropTypes.func,
  loginComponent: PropTypes.func,
  roles: PropTypes.array,
};

AuthenticationGuard.defaultProps = {
  roles: [],
};
