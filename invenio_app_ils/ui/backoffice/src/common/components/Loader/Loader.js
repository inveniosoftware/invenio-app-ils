import React, { Component } from 'react';
import { Loader as UILoader } from 'semantic-ui-react';

export class Loader extends Component {
  render() {
    const isLoading = this.props.isLoading;
    return isLoading ? (
      <UILoader active size="huge" inline="centered" />
    ) : (
      this.props.children
    );
  }
}
