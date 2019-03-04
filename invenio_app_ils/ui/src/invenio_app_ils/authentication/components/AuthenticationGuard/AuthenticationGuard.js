import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  sessionManager,
  authenticationService,
} from '../../../authentication/services';

export class AuthenticationGuard extends Component {
  render() {
    const {
      authorizedComponent: Authorized,
      unAuthorizedComponent: UnAuthorized,
      roles,
      ...restParams
    } = this.props;

    if (!sessionManager.authenticated) {
      authenticationService.login(window.location.pathname);
      return null;
    }

    if (sessionManager.authenticated && !sessionManager.hasRoles(roles)) {
      console.error(
        `User has no permission to access the page ${window.location.pathname}`
      );
      return <UnAuthorized />;
    }
    return <Authorized {...restParams} />;
  }
}

AuthenticationGuard.propTypes = {
  authorizedComponent: PropTypes.func.isRequired,
  unAuthorizedComponent: PropTypes.func.isRequired,
  roles: PropTypes.array,
};

AuthenticationGuard.defaultProps = {
  roles: [],
};
