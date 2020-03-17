import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { AuthenticationRoutes } from '@routes/urls';
import { goTo } from '@history';

export class RedirectToLoginButton extends Component {
  onClick = () => {
    const { nextUrl } = this.props;
    return goTo(
      AuthenticationRoutes.redirectAfterLogin(
        nextUrl || window.location.pathname
      )
    );
  };

  render() {
    const { renderClass, ...restProps } = this.props;
    const RenderComponent = renderClass || Button;
    return <RenderComponent {...restProps} onClick={this.onClick} />;
  }
}

RedirectToLoginButton.propTypes = {
  content: PropTypes.string.isRequired,
  nextUrl: PropTypes.string,
};

RedirectToLoginButton.defaultProps = {
  content: 'Login',
};
