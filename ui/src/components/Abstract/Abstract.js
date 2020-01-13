import ShowMore from 'react-show-more';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class Abstract extends Component {
  render() {
    const { children, content, lines } = this.props;
    return (
      <ShowMore
        lines={lines}
        more="Show more"
        less="Show less"
        anchorClass="button-show-more"
      >
        {children || content}
      </ShowMore>
    );
  }
}

Abstract.propTypes = {
  lines: PropTypes.number.isRequired,
};
