import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { item as itemApi } from '../../../../../common/api';
import { fromISO, toShortDate } from '../../../../../common/api/date';
import { openRecordEditor } from '../../../../../common/urls';
import { ResultsTable } from '../../../../../common/components';
import { NewButton } from '../../../components/buttons';

export class ResultsList extends Component {
  constructor(props) {
    super(props);
    this.viewDetailsClickHandler = this.props.viewDetailsClickHandler;
  }

  _getFormattedDate = d => (d ? toShortDate(fromISO(d)) : '');

  prepareData() {
    return this.props.results.map(row => ({
      ID: row.metadata.item_pid,
      'Document ID': row.metadata.document_pid,
      Status: row.metadata.status,
      'Internal location': row.metadata.internal_location.name,
      Created: this._getFormattedDate(row.created),
      Updated: this._getFormattedDate(row.updated),
    }));
  }

  render() {
    const rows = this.prepareData();
    const maxRowsToShow =
      rows.length > ResultsTable.defaultProps.showMaxRows
        ? rows.length
        : ResultsTable.defaultProps.showMaxRows;
    const headerActionComponent = (
      <NewButton
        text={'New item'}
        clickHandler={() => {
          openRecordEditor(itemApi.url);
        }}
      />
    );

    return rows.length ? (
      <ResultsTable
        rows={rows}
        title={''}
        headerActionComponent={headerActionComponent}
        rowActionClickHandler={this.viewDetailsClickHandler}
        showMaxRows={maxRowsToShow}
      />
    ) : null;
  }
}

ResultsList.propTypes = {
  results: PropTypes.array.isRequired,
  viewDetailsClickHandler: PropTypes.func.isRequired,
};
