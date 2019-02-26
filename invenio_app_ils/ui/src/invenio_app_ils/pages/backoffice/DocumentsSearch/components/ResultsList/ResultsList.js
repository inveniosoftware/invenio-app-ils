import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { document as documentApi } from '../../../../../common/api';
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
      ID: row.metadata.document_pid,
      Title: row.metadata.title,
      Authors: row.metadata.authors,
      Created: this._getFormattedDate(row.created),
      Updated: this._getFormattedDate(row.updated),
    }));
  }

  render() {
    const rows = this.prepareData();
    const headerActionComponent = (
      <NewButton
        text={'New item'}
        clickHandler={() => {
          openRecordEditor(documentApi.url);
        }}
      />
    );

    return rows.length ? (
      <ResultsTable
        rows={rows}
        title={''}
        headerActionComponent={headerActionComponent}
        rowActionClickHandler={this.viewDetailsClickHandler}
      />
    ) : null;
  }
}

ResultsList.propTypes = {
  results: PropTypes.array.isRequired,
  viewDetailsClickHandler: PropTypes.func.isRequired,
};
