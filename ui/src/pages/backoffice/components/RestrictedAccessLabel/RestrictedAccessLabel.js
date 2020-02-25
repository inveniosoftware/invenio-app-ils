import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Icon, Label } from 'semantic-ui-react';

/**
 * Displays red restricted access label
 */
export default class RestrictedAccessLabel extends Component {
  render() {
    const { isRestricted } = this.props;
    return isRestricted ? (
      <>
        <Label size="large" color="red">
          <Icon name="lock" />
          Restricted access
        </Label>
        <br />
      </>
    ) : null;
  }
}

RestrictedAccessLabel.propTypes = {
  isRestricted: PropTypes.bool.isRequired,
};
