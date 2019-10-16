import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export default class SeeAllButton extends Component {
  render() {
    const { fluid, disabled } = this.props;
    return (
      <Button
        as={Link}
        size="tiny"
        {...(disabled ? { disabled: true } : {})}
        {...(fluid ? { fluid: true } : {})}
        to={this.props.url}
      >
        See all
      </Button>
    );
  }
}

SeeAllButton.propTypes = {
  fluid: PropTypes.bool,
  disabled: PropTypes.bool,
  url: PropTypes.string.isRequired,
};

SeeAllButton.defaultProps = {
  fluid: false,
  disabled: false,
};
