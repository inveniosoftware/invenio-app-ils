import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export default class EditButton extends Component {
  render() {
    const { fluid, disabled, to } = this.props;
    return (
      <Button
        icon
        primary
        as={Link}
        size="small"
        labelPosition="left"
        to={to}
        {...(disabled ? { disabled: true } : {})}
        {...(fluid ? { fluid: true } : {})}
      >
        <Icon name="edit" />
        {this.props.text}
      </Button>
    );
  }
}

EditButton.propTypes = {
  text: PropTypes.string,
  fluid: PropTypes.bool,
  disabled: PropTypes.bool,
};

EditButton.defaultProps = {
  text: 'Edit',
  fluid: false,
  disabled: false,
};
