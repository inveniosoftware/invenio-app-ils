import { authenticationService } from './AuthenticationService';

class SessionManager {
  constructor() {
    let tokenData;
    // Initialize to anonymous user
    this.setAnonymous();

    if (process.env.NODE_ENV === 'production') {
      let encodedToken = authenticationService.getTokenFromDOM();
      if (encodedToken) {
        tokenData = authenticationService.decodeProductionToken(encodedToken);
        this.setUser(encodedToken, tokenData);
      }
    } else {
      if (process.env.REACT_APP_JWT_TOKEN) {
        tokenData = {
          sub: process.env.REACT_APP_USER_ID,
          locationPid: process.env.REACT_APP_LOCATION_ID,
          roles: [process.env.REACT_APP_USER_ROLE],
          exp: process.env.REACT_APP_JWT_TOKEN_EXPIRATION,
          username: process.env.REACT_APP_JWT_USERNAME,
        };
        this.setUser(process.env.REACT_APP_JWT_TOKEN, tokenData);
      }
    }
  }

  setAnonymous() {
    this.user = null;
    this.token = null;
    this.authenticated = false;
  }

  setUser(token, tokenData) {
    if (tokenData['sub']) {
      this.user = {
        id: tokenData['sub'],
        roles: tokenData['roles'] || [],
        username: tokenData['username'],
        locationPid: tokenData['locationPid'],
      };
      this.token = {
        value: token,
        expiration: tokenData['exp'],
      };
      this.authenticated = true;
    } else {
      this.setAnonymous();
    }
  }

  hasRoles = roles => {
    if (!roles.length) {
      return true;
    }
    // any of needed roles found in user roles
    const anyNeededRoleFound = roles.some(
      role => this.user.roles.indexOf(role) !== -1
    );
    return anyNeededRoleFound;
  };
}

export const sessionManager = new SessionManager();
