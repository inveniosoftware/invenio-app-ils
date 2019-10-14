import ShowMore from 'react-show-more';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class DocumentAbstract extends Component {
  render() {
    const { metadata, lines } = this.props;
    return (
      <ShowMore
        lines={lines}
        more="Show more"
        less="Show less"
        anchorClass="button-show-more"
      >
        {metadata.abstract}
      </ShowMore>
    );
  }
}

DocumentAbstract.propTypes = {
  lines: PropTypes.number.isRequired,
};
