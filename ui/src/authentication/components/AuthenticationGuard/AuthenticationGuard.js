import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { authenticationService } from '@authentication/services';
import { AuthenticationRoutes } from '@routes/urls';

export default class AuthenticationGuard extends Component {
  render() {
    const {
      authorizedComponent: Authorized,
      unAuthorizedComponent: UnAuthorized,
      loginComponent: LoginComponent,
      roles,
      user,
      isAnonymous,
      isLoading,
      ...restParams
    } = this.props;

    if (isLoading) {
      return null;
    }

    if (isAnonymous) {
      return LoginComponent ? (
        <LoginComponent />
      ) : (
        <Redirect
          to={AuthenticationRoutes.redirectAfterLogin(
            `${window.location.pathname}${window.location.search}`
          )}
        />
      );
    }

    if (!isAnonymous && !authenticationService.hasRoles(user, roles)) {
      this.props.sendErrorNotification(
        'Unauthorized',
        `You have no permission to access the page ${window.location.pathname}`
      );

      return UnAuthorized ? <UnAuthorized /> : null;
    }
    return <Authorized {...restParams} />;
  }
}

//set loginComponent prop to render conditionally depending on auth
AuthenticationGuard.propTypes = {
  authorizedComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
  unAuthorizedComponent: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]),
  loginComponent: PropTypes.func,
  roles: PropTypes.array,
};

AuthenticationGuard.defaultProps = {
  roles: [],
};
