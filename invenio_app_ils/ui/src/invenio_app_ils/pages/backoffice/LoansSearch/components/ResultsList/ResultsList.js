import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResultsTable } from '../../../../../common/components';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';
import { loan as loanApi } from '../../../../../common/api';
import { ExportToCSV } from '../../../components/ExportToCSV';

export class ResultsList extends Component {
  constructor(props) {
    super(props);
    this.viewDetailsClickHandler = this.props.viewDetailsClickHandler;
  }

  prepareData(data) {
    return data.map(row => formatter.loan.toTable(row));
  }

  render() {
    const rows = this.prepareData(this.props.results);
    const maxRowsToShow =
      rows.length > ResultsTable.defaultProps.showMaxRows
        ? rows.length
        : ResultsTable.defaultProps.showMaxRows;

    const headerActionComponent = (
      <ExportToCSV
        countQuery={loanApi.count}
        exportQuery={loanApi.exportToCSV}
      />
    );

    return (
      <ResultsTable
        rows={rows}
        name={'loans'}
        headerActionComponent={headerActionComponent}
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
