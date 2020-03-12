import { toShortDateTime } from '@api/date';
import { MetadataTable } from '@pages/backoffice';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import _get from 'lodash/get';

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

    const created_by_type = _get(document, 'metadata.created_by.type');
    const created_by_value = _get(document, 'metadata.created_by.value', '-');
    const created_by = created_by_type
      ? `${created_by_type}: ${created_by_value}`
      : `${created_by_value}`;
    rows.push({
      name: 'Created by',
      value: `${created_by}`,
    });

    const updated_by_type = _get(document, 'metadata.updated_by.type');
    const updated_by_value = _get(document, 'metadata.updated_by.value', '-');
    const updated_by = updated_by_type
      ? `${updated_by_type}: ${updated_by_value}`
      : `${updated_by_value}`;
    rows.push({
      name: 'Updated by',
      value: `${updated_by}`,
    });

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
