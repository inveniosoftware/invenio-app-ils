import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { authenticationService } from '@authentication/services';
import { Button } from 'semantic-ui-react';

export class LoginRedirectButton extends Component {
  render() {
    const { content } = this.props;
    return (
      <Button
        positive
        content={content}
        onClick={() => authenticationService.login(window.location.pathname)}
      />
    );
  }
}

LoginRedirectButton.propTypes = {
  content: PropTypes.string.isRequired,
};

LoginRedirectButton.defaultProps = {
  content: 'Login',
};
