import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { AuthenticationRoutes } from '@routes/urls';
import { goTo } from '@history';

export class RedirectToLoginButton extends Component {
  render() {
    const { content, nextUrl, ...restProps } = this.props;
    return (
      <Button
        fluid
        content={content}
        {...restProps}
        onClick={() => {
          goTo(
            AuthenticationRoutes.redirectAfterLogin(
              nextUrl || window.location.pathname
            )
          );
        }}
      />
    );
  }
}

RedirectToLoginButton.propTypes = {
  content: PropTypes.string.isRequired,
  nextUrl: PropTypes.string,
};

RedirectToLoginButton.defaultProps = {
  content: 'Login',
};
