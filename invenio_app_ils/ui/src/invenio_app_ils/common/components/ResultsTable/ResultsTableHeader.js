import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

export default class ResultsTableHeader extends Component {
  renderHeaderCell = cellName => {
    if (cellName === 'ID') {
      return (
        <Table.HeaderCell width={2} key={cellName}>
          {cellName}
        </Table.HeaderCell>
      );
    } else {
      return <Table.HeaderCell key={cellName}>{cellName}</Table.HeaderCell>;
    }
  };

  render() {
    const { columns, withRowAction } = this.props;
    const headerColumns = columns.map(column => this.renderHeaderCell(column));
    return (
      <Table.Header>
        <Table.Row data-test="header">
          <Table.HeaderCell width={withRowAction ? 2 : 1} collapsing />
          {headerColumns}
        </Table.Row>
      </Table.Header>
    );
  }
}

ResultsTableHeader.propTypes = {
  columns: PropTypes.array.isRequired,
  withRowAction: PropTypes.bool,
};

ResultsTableHeader.defaultProps = {
  withRowAction: false,
};
