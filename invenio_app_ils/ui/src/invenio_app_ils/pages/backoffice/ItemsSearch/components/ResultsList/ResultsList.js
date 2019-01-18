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
      'Document ID': row.metadata.document_pid,
      Status: row.metadata.status,
      'Internal location': row.metadata.internal_location.name,
      Created: row.created,
      Updated: row.updated,
    }));
  }

  render() {
    const rows = this.prepareData();

    return rows.length ? (
      <ResultsTable
        rows={rows}
        name={'All items'}
        detailsClickHandler={this.viewDetailsClickHandler}
      />
    ) : null;
  }
}

ResultsList.propTypes = {
  results: PropTypes.array.isRequired,
  viewDetailsClickHandler: PropTypes.func.isRequired,
};
