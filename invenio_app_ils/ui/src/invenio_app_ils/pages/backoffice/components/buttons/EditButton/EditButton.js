import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';

export default class EditButton extends Component {
  render() {
    const { fluid, disabled } = this.props;
    return (
      <Button
        as={Link}
        to={this.props.url}
        icon
        primary
        size="small"
        labelPosition="left"
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
  disabled: PropTypes.bool,
  fluid: PropTypes.bool,
  text: PropTypes.string,
  url: PropTypes.func.isRequired,
};

EditButton.defaultProps = {
  disabled: false,
  fluid: false,
  text: 'Edit',
};
