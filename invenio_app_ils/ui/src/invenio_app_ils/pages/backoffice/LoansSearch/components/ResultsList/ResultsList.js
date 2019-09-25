import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResultsTable } from '../../../../../common/components';
import { OverdueLoanSendMailModal } from '../../../components';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';
import { ExportReactSearchKitResults } from '../../../components';
import { loan as loanApi } from '../../../../../common/api';

export class ResultsList extends Component {
  prepareData(data) {
    return data.map(row => {
      const actions = row.metadata.is_overdue && (
        <OverdueLoanSendMailModal loan={row} />
      );
      return formatter.loan.toTable(row, actions);
    });
  }

  render() {
    const rows = this.prepareData(this.props.results);
    const maxRowsToShow =
      rows.length > ResultsTable.defaultProps.showMaxRows
        ? rows.length
        : ResultsTable.defaultProps.showMaxRows;

    const headerActionComponent = (
      <ExportReactSearchKitResults exportBaseUrl={loanApi.url} />
    );

    return (
      <ResultsTable
        rows={rows}
        name={'loans'}
        headerActionComponent={headerActionComponent}
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
