import ShowMore from 'react-show-more';
import React, { Component } from 'react';

export class DocumentAbstract extends Component {
  render() {
    const { metadata } = this.props;
    return (
      <ShowMore
        lines={20}
        more="Show more"
        less="Show less"
        anchorClass="button-show-more"
      >
        {metadata.abstract}
      </ShowMore>
    );
  }
}
