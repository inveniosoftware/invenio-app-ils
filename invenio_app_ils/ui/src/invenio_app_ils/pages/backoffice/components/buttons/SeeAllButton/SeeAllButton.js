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
        {this.props.text}
      </Button>
    );
  }
}

SeeAllButton.propTypes = {
  disabled: PropTypes.bool,
  fluid: PropTypes.bool,
  text: PropTypes.string,
  url: PropTypes.string.isRequired,
};

SeeAllButton.defaultProps = {
  disabled: false,
  fluid: false,
  text: 'See All',
};
