class SessionManager {
  constructor() {
    this.setAnonymous();
    this.setUserConfirmed(false);
  }

  isAnonymous() {
    return this.user === null;
  }

  isAuthenticated() {
    return !this.isAnonymous();
  }

  setAnonymous() {
    this.user = null;
  }

  setUserConfirmed(confirmed) {
    this.userConfirmed = confirmed;
  }

  setUser(user) {
    this.user = {
      id: user['id'],
      roles: user['roles'] || [],
      username: user['username'],
      locationPid: user['locationPid'],
    };
  }
}

export const sessionManager = new SessionManager();
