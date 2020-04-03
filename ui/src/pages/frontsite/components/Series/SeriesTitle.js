import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';

export class SeriesTitle extends Component {
  render() {
    const { title, mode_of_issuance } = this.props.metadata;
    return (
      <>
        {mode_of_issuance.toUpperCase()}
        <Header as="h2">{title}</Header>
      </>
    );
  }
}

SeriesTitle.propTypes = {
  metadata: PropTypes.object.isRequired,
};
