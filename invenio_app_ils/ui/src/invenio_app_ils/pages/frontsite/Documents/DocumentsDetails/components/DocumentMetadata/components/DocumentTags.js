import React, { Component } from 'react';
import { Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export class DocumentTags extends Component {
  renderTags = () => {
    return this.props.tags.map(tag => <Label key={tag.pid}>{tag.name}</Label>);
  };

  render() {
    if (this.props.tags.length > 0) {
      return <>{this.renderTags()}</>;
    }
    return null;
  }
}

DocumentTags.propTypes = {
  tags: PropTypes.array.isRequired,
};
