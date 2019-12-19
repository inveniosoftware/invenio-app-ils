import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export default class NewButton extends Component {
  render() {
    const { fluid, disabled, to } = this.props;
    return (
      <Button
        icon
        positive
        as={Link}
        size="small"
        labelPosition="left"
        {...this.props}
      >
        <Icon name="plus" />
        {this.props.text}
      </Button>
    );
  }
}

NewButton.propTypes = {
  text: PropTypes.string,
  fluid: PropTypes.bool,
  disabled: PropTypes.bool,
};

NewButton.defaultProps = {
  text: 'New',
  fluid: false,
  disabled: false,
};
