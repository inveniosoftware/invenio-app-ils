import React, { Component } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export default class NewButton extends Component {
  render() {
    const { fluid, disabled } = this.props;
    return (
      <Button
        size="small"
        {...(disabled ? { disabled: true } : {})}
        {...(fluid ? { fluid: true } : {})}
        positive
        icon
        labelPosition="left"
        onClick={this.props.clickHandler}
      >
        <Icon name="plus" />
        {this.props.text}
      </Button>
    );
  }
}

NewButton.propTypes = {
  clickHandler: PropTypes.func.isRequired,
  text: PropTypes.string,
  fluid: PropTypes.bool,
  disabled: PropTypes.bool,
};

NewButton.defaultProps = {
  text: 'New',
  fluid: false,
  disabled: false,
};
