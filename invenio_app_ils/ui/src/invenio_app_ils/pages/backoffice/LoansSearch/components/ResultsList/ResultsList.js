import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fromISO, toShortDate } from '../../../../../common/api/date';
import { ResultsTable } from '../../../../../common/components';

export class ResultsList extends Component {
  constructor(props) {
    super(props);
    this.viewDetailsClickHandler = this.props.viewDetailsClickHandler;
  }

  _getFormattedDate = d => (d ? toShortDate(fromISO(d)) : '');

  prepareData(data) {
    return data.map(row => ({
      ID: row.id,
      State: row.metadata.state,
      'Item ID': row.metadata.item_pid,
      'Document ID': row.metadata.document_pid,
      'Patron ID': row.metadata.patron_pid,
      Created: this._getFormattedDate(row.created),
      'Transaction date': this._getFormattedDate(row.metadata.transaction_date),
    }));
  }

  render() {
    const rows = this.prepareData(this.props.results);
    const maxRowsToShow =
      rows.length > ResultsTable.defaultProps.showMaxRows
        ? rows.length
        : ResultsTable.defaultProps.showMaxRows;

    return (
      <ResultsTable
        rows={rows}
        name={'loans'}
        rowActionClickHandler={this.viewDetailsClickHandler}
        showMaxRows={maxRowsToShow}
      />
    );
  }
}

ResultsList.propTypes = {
  results: PropTypes.array.isRequired,
  viewDetailsClickHandler: PropTypes.func.isRequired,
};
