import { Header } from 'semantic-ui-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class DocumentTitle extends Component {
  render() {
    const { metadata } = this.props;
    return <Header as={'h2'}>{metadata.title}</Header>;
  }
}

DocumentTitle.propTypes = {
  metadata: PropTypes.object.isRequired,
};
