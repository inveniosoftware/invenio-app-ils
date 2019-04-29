import React, { Component } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export default class EditButton extends Component {
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
        <Icon name="edit" />
        {this.props.text}
      </Button>
    );
  }
}

EditButton.propTypes = {
  clickHandler: PropTypes.func.isRequired,
  text: PropTypes.string,
  fluid: PropTypes.bool,
  disabled: PropTypes.bool,
};

EditButton.defaultProps = {
  text: 'Edit',
  fluid: false,
  disabled: false,
};
