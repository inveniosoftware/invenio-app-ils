import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export default class NewButton extends Component {
  render() {
    const { fluid, disabled } = this.props;
    return (
      <Button
        size="small"
        as={Link}
        to={this.props.url}
        {...(disabled ? { disabled: true } : {})}
        {...(fluid ? { fluid: true } : {})}
        positive
        icon
        labelPosition="left"
      >
        <Icon name="plus" />
        {this.props.text}
      </Button>
    );
  }
}

NewButton.propTypes = {
  disabled: PropTypes.bool,
  fluid: PropTypes.bool,
  text: PropTypes.string,
  url: PropTypes.string.isRequired,
};

NewButton.defaultProps = {
  disabled: false,
  fluid: false,
  text: 'New',
};
