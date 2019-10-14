import React, { Component } from 'react';
import { Loader as UILoader } from 'semantic-ui-react';

export class Loader extends Component {
  renderElement = () => {
    if (this.props.renderElement) {
      return this.props.renderElement(this.props);
    }
    return <UILoader />;
  };

  render() {
    const isLoading = this.props.isLoading;
    return isLoading ? this.renderElement() : this.props.children;
  }
}
