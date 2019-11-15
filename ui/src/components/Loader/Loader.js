import React, { Component } from 'react';
import { Loader as UILoader } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export class Loader extends Component {
  renderElement = () => {
    if (this.props.renderElement) {
      return this.props.renderElement(this.props);
    }
    return <UILoader active size="huge" inline="centered" />;
  };

  render() {
    const isLoading = this.props.isLoading;
    return isLoading ? this.renderElement() : this.props.children;
  }
}

Loader.propTypes = {
  renderElement: PropTypes.func,
};
