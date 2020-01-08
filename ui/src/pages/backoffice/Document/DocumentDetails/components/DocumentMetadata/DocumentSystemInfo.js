import { toShortDateTime } from '@api/date';
import { MetadataTable } from '@pages/backoffice';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

export class DocumentSystemInfo extends Component {
  renderInternalNotes = () => {
    const { document } = this.props;

    if (!isEmpty(document.metadata.internal_notes)) {
      return document.metadata.internal_notes.map((entry, index) => (
        <>
          User {entry.user} noted for field {entry.field}:<br />
          <p>{entry.value}</p>
          <br />
        </>
      ));
    }
  };

  prepareData = () => {
    const { document } = this.props;
    let rows = [
      {
        name: 'Created',
        value: toShortDateTime(document.created),
      },
      {
        name: 'Last updated',
        value: toShortDateTime(document.updated),
      },
    ];
    if (!isEmpty(document.metadata.created_by)) {
      rows.push({
        name: 'Created by',
        value: `${document.metadata.created_by.type}: ${document.metadata.created_by.value}`,
      });
    }
    if (!isEmpty(document.metadata.updated_by)) {
      rows.push({
        name: 'Last updated by',
        value: `${document.metadata.updated_by.type}: ${document.metadata.updated_by.value}`,
      });
    }
    rows.push(
      {
        name: 'Curated',
        value: document.metadata.curated,
      },
      {
        name: 'Source',
        value: document.metadata.source,
      },
      {
        name: 'Internal notes',
        value: this.renderInternalNotes(),
      }
    );

    return rows;
  };

  render() {
    return <MetadataTable rows={this.prepareData()} />;
  }
}

DocumentSystemInfo.propTypes = {
  document: PropTypes.object.isRequired,
};
