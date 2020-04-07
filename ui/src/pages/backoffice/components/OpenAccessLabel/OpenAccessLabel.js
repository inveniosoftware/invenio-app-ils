import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Icon, Label } from 'semantic-ui-react';

/**
 * Displays green open access label
 */
export default class OpenAccessLabel extends Component {
  render() {
    const { openAccess, size } = this.props;
    return (
      openAccess && (
        <>
          <Label size={size} color="green">
            <Icon name="lock open" />
            Open access
          </Label>
          <br />
        </>
      )
    );
  }
}

OpenAccessLabel.propTypes = {
  openAccess: PropTypes.bool.isRequired,
  size: PropTypes.string,
};

OpenAccessLabel.defaultProps = {
  size: 'large',
};
