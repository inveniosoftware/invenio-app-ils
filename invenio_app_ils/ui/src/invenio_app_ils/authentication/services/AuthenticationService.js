class AuthenticationService {
  getTokenFromDOM = () => {
    const element = document.getElementsByName('authorized_token');
    if (element.length > 0 && element[0].hasAttribute('value')) {
      return element[0].value;
    }
    return '';
  };

  decodeProductionToken = token => {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('Token decoding is available only on production mode.');
    }
    if (!token) {
      throw new Error('Token is empty!');
    }
    return JSON.parse(atob(token.split('.')[1]));
  };

  login = nextUrl => {
    window.location =
      window.location.origin + `/login?next=${encodeURIComponent(nextUrl)}`;
  };

  logout = nextUrl => {
    window.location =
      window.location.origin + `/logout?next=${encodeURIComponent(nextUrl)}`;
  };
}

export const authenticationService = new AuthenticationService();
