import React, { Component } from 'react';
import { Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export class DocumentTags extends Component {
  constructor(props) {
    super(props);
    this.tags = props.tags;
  }

  renderTags = () => {
    return this.tags.map(tag => <Label>{tag.name}</Label>);
  };

  render() {
    if (this.tags.length > 0) {
      return <>{this.renderTags()}</>;
    } else {
      return null;
    }
  }
}

DocumentTags.propTypes = {
  tags: PropTypes.array.isRequired,
};
