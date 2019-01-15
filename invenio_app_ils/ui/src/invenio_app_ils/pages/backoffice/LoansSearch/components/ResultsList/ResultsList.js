import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResultsTable } from '../../../../../common/components';

export class ResultsList extends Component {
  constructor(props) {
    super(props);
    this.viewDetailsClickHandler = this.props.viewDetailsClickHandler;
  }

  render() {
    const columns = [
      'id',
      'state',
      'patron_pid',
      'item_pid',
      'created',
      'start_date',
      'end_date',
    ];
    const rows = this.props.results.map(loanRecord => ({
      ...loanRecord,
      ...loanRecord.metadata,
    }));
    return rows.length ? (
      <ResultsTable
        columns={columns}
        rows={rows}
        name={'Loans'}
        detailsClickHandler={this.viewDetailsClickHandler}
      />
    ) : null;
  }
}

ResultsList.propTypes = {
  results: PropTypes.array.isRequired,
  viewDetailsClickHandler: PropTypes.func.isRequired,
};
