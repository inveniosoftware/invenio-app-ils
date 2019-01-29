import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fromISO, toString } from '../../../../../common/api/date';
import { ResultsTable } from '../../../../../common/components';

export class ResultsList extends Component {
  constructor(props) {
    super(props);
    this.viewDetailsClickHandler = this.props.viewDetailsClickHandler;
  }

  _getFormattedDate = d => (d ? toString(fromISO(d)) : '');

  prepareData() {
    return this.props.results.map(row => ({
      ID: row.id,
      'Document ID': row.metadata.document.document_pid,
      Status: row.metadata.status,
      'Internal location': row.metadata.internal_location.name,
      Created: this._getFormattedDate(row.created),
      Updated: this._getFormattedDate(row.updated),
    }));
  }

  render() {
    const rows = this.prepareData();

    return rows.length ? (
      <ResultsTable
        rows={rows}
        name={'All items'}
        actionClickHandler={this.viewDetailsClickHandler}
      />
    ) : null;
  }
}

ResultsList.propTypes = {
  results: PropTypes.array.isRequired,
  viewDetailsClickHandler: PropTypes.func.isRequired,
};
