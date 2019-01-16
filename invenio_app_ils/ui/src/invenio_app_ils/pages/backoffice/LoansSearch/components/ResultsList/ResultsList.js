import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResultsTable } from '../../../../../common/components';

export class ResultsList extends Component {
  constructor(props) {
    super(props);
    this.viewDetailsClickHandler = this.props.viewDetailsClickHandler;
  }

  prepareData() {
    return this.props.results.map(row => ({
      ID: row.id,
      State: row.metadata.state,
      'Item ID': row.metadata.item_pid,
      'Document ID': row.metadata.document_pid,
      'Patron ID': row.metadata.patron_pid,
      Created: row.created,
      'Transaction date': row.metadata.transaction_date,
    }));
  }

  render() {
    const rows = this.prepareData();

    return (
      <ResultsTable
        rows={rows}
        name={''}
        detailsClickHandler={this.viewDetailsClickHandler}
      />
    );
  }
}

ResultsList.propTypes = {
  results: PropTypes.array.isRequired,
  viewDetailsClickHandler: PropTypes.func.isRequired,
};
