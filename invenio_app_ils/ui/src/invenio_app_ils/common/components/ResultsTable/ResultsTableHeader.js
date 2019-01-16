import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

export default class ResultsTableHeader extends Component {
  _renderHeaderCell = cellName => {
    return <Table.HeaderCell key={cellName}>{cellName}</Table.HeaderCell>;
  };

  render() {
    const { columns } = this.props;

    let headerColumns = columns.map(column => this._renderHeaderCell(column));

    return (
      <Table.Header>
        <Table.Row data-test="header">
          <Table.HeaderCell collapsing />
          {headerColumns}
        </Table.Row>
      </Table.Header>
    );
  }
}

ResultsTableHeader.propTypes = {
  columns: PropTypes.array.isRequired,
};
