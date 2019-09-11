import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResultsTable } from '../../../../../common/components';
import { SendMailModal } from '../../../components';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';

export class ResultsList extends Component {
  prepareData(data) {
    return data.map(row => {
      const actions =
        row.metadata.is_overdue && row.metadata.state === 'ITEM_ON_LOAN' ? (
          <SendMailModal loan={row} />
        ) : null;
      return formatter.loan.toTable(row, actions);
    });
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
        rowActionClickHandler={this.props.viewDetailsClickHandler}
        showMaxRows={maxRowsToShow}
      />
    );
  }
}

ResultsList.propTypes = {
  results: PropTypes.array.isRequired,
  viewDetailsClickHandler: PropTypes.func.isRequired,
};
