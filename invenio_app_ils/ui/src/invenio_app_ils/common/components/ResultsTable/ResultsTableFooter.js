import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export default class ResultsTableFooter extends Component {
  constructor(props) {
    super(props);
    this.colspan = this.props.columnsNumber;
  }

  render() {
    const { allRowsNumber, currentPage, showMaxRows } = this.props;
    const itemNumber = allRowsNumber;
    const start = (currentPage - 1) * showMaxRows;
    const end = Math.min(start + showMaxRows, allRowsNumber);
    return itemNumber > showMaxRows ? (
      <Table.Footer fullWidth data-test="footer">
        <Table.Row>
          <Table.HeaderCell colSpan={this.colspan + 1} textAlign="right">
            <span>
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
};

ResultsTableFooter.defaultProps = {
  seeAllComponent: null,
  paginationComponent: null,
};
