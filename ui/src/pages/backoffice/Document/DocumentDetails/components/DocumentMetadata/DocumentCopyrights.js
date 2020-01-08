import { MetadataTable } from '@pages/backoffice';
import capitalize from 'lodash/capitalize';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class DocumentCopyrights extends Component {
  renderCopyrights() {
    const { copyrights } = this.props.document.metadata;
    const rows = [];
    if (copyrights) {

      for (const [key, val] of Object.entries(copyrights)) {
        rows.push({name: capitalize(key), value: val});
      }
    }
    return rows;
  }

  render() {
      return <MetadataTable rows={this.renderCopyrights()} />;
  }
}

DocumentCopyrights.propTypes = {
  document: PropTypes.object.isRequired,
};
