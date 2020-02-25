import { MetadataTable } from '@pages/backoffice/components';
import capitalize from 'lodash/capitalize';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export class DocumentCopyrights extends Component {
  renderCopyrights() {
    const { copyrights } = this.props.document.metadata;
    const rows = [];
    if (copyrights) {
      for (const [key, val] of Object.entries(copyrights)) {
        rows.push({ name: capitalize(key), value: val });
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
