import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export default class ResultsTableFooter extends Component {
  render() {
    const {
      allRowsNumber,
      currentPage,
      showMaxRows,
      showAllResults,
    } = this.props;
    const start = showAllResults ? 0 : (currentPage - 1) * showMaxRows;
    const end = showAllResults
      ? allRowsNumber
      : Math.min(start + showMaxRows, allRowsNumber);
    return showAllResults || allRowsNumber > showMaxRows ? (
      <Table.Footer fullWidth data-test="footer">
        <Table.Row>
          <Table.HeaderCell
            colSpan={this.props.columnsNumber + 1}
            textAlign="right"
          >
            <span className="results-table-compact-summary">
              Showing entries {start + 1}-{end} of {allRowsNumber}{' '}
            </span>
            <span>{this.props.seeAllComponent}</span>
            <span>{this.props.paginationComponent}</span>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    ) : null;
  }
}

ResultsTableFooter.propTypes = {
  allRowsNumber: PropTypes.number.isRequired,
  columnsNumber: PropTypes.number.isRequired,
  showMaxRows: PropTypes.number.isRequired,
  seeAllComponent: PropTypes.node,
  paginationComponent: PropTypes.node,
  showAllResults: PropTypes.bool,
};

ResultsTableFooter.defaultProps = {
  seeAllComponent: null,
  paginationComponent: null,
  showAllResults: false,
};
