import React, { Component } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export default class LoginButton extends Component {
  render() {
    const { clickHandler, text } = this.props;
    return (
      <Button
        size="small"
        secondary
        labelPosition="left"
        onClick={clickHandler}
      >
        <Icon name="sign in alternate" />
        {text}
      </Button>
    );
  }
}

LoginButton.propTypes = {
  clickHandler: PropTypes.func.isRequired,
  text: PropTypes.string,
};

LoginButton.defaultProps = {
  text: 'Login',
};
