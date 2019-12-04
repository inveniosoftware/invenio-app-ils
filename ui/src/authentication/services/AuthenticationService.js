import { http } from '@api';
import { sessionManager } from './SessionManager';

class AuthenticationService {
  loginWithOauthProvider = (nextUrl, providerUrl) => {
    localStorage.setItem('ILS_USER_WAS_LOGGEDIN', true);
    sessionManager.setAnonymous();
    let redirectOauthUrl = `${
      process.env.REACT_APP_BACKEND_DEV_BASE_URL
    }${providerUrl}?next=${encodeURIComponent(nextUrl)}`;
    if (process.env.NODE_ENV === 'production') {
      redirectOauthUrl =
        window.location.origin +
        `${providerUrl}?next=${encodeURIComponent(nextUrl)}`;
    }
    window.location = redirectOauthUrl;
  };

  loginWithLocalAccount = data => {
    let loginUrl = `${process.env.REACT_APP_BACKEND_DEV_BASE_URL}/api/login`;
    if (process.env.NODE_ENV === 'production') {
      loginUrl = `${window.location.origin}/api/login`;
    }
    return http.post(loginUrl, data);
  };

  logout = () => {
    let logoutUrl = `${process.env.REACT_APP_BACKEND_DEV_BASE_URL}/api/logout`;
    if (process.env.NODE_ENV === 'production') {
      logoutUrl = `${window.location.origin}/api/logout`;
    }
    return http.post(logoutUrl);
  };

  fetchProfile = () => {
    return http.get('/me');
  };

  confirmUser = token => {
    return http.post('/confirm-email', { token });
  };

  hasRoles = (user, roles) => {
    if (!roles.length) {
      return true;
    }
    // any of needed roles found in user roles
    const anyNeededRoleFound = roles.some(
      role => user.roles.indexOf(role) !== -1
    );
    return anyNeededRoleFound;
  };
}

export const authenticationService = new AuthenticationService();
