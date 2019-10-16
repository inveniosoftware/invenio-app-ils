import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

export default class ClearButton extends Component {
  render() {
    const { fluid, disabled } = this.props;
    return (
      <Button
        size="small"
        {...(disabled ? { disabled: true } : {})}
        {...(fluid ? { fluid: true } : {})}
        primary
        icon
        labelPosition="left"
        onClick={this.props.clickHandler}
      >
        <Icon name="undo" />
        {this.props.text}
      </Button>
    );
  }
}

ClearButton.propTypes = {
  clickHandler: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  fluid: PropTypes.bool,
  text: PropTypes.string,
};

ClearButton.defaultProps = {
  disabled: false,
  fluid: false,
  text: 'Clear query',
};
