import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Icon, Label } from 'semantic-ui-react';

export default class RestrictedLabel extends Component {
  render() {
    const { openAccess } = this.props;
    return (
      !openAccess && (
        <>
          <Label size="large" color="red">
            <Icon name="lock" />
            Restricted access
          </Label>
          <br />
        </>
      )
    );
  }
}

RestrictedLabel.propTypes = {
  openAccess: PropTypes.bool.isRequired,
};
