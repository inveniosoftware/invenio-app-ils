import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export default class SeeAllButton extends Component {
  render() {
    const { fluid, disabled } = this.props;
    return (
      <Button
        size="small"
        {...(disabled ? { disabled: true } : {})}
        {...(fluid ? { fluid: true } : {})}
        onClick={this.props.clickHandler}
      >
        See all
      </Button>
    );
  }
}

SeeAllButton.propTypes = {
  clickHandler: PropTypes.func.isRequired,
  fluid: PropTypes.bool,
  disabled: PropTypes.bool,
};

SeeAllButton.defaultProps = {
  fluid: false,
  disabled: false,
};
