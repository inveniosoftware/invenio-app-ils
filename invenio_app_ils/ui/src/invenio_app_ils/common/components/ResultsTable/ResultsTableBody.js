import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Table } from 'semantic-ui-react';

export default class ResultsTableBody extends Component {
  _renderCell = (cell, column, id, col_index) => {
    return (
      <Table.Cell key={col_index + '-' + id} data-test={column + '-' + id}>
        {cell}
      </Table.Cell>
    );
  };

  _renderRow = (columns, rows) => {
    return rows.map(row => {
      const withRowAction = this.props.rowActionClickHandler ? (
        <Button
          circular
          compact
          icon="eye"
          onClick={() => {
            this.props.rowActionClickHandler(row.ID);
          }}
          data-test={'btn-view-details-' + row.ID}
        />
      ) : null;

      return (
        <Table.Row key={row.ID} data-test={row.ID}>
          <Table.Cell textAlign="center">{withRowAction}</Table.Cell>
          {columns.map((column, idx) =>
            this._renderCell(
              row[column] ? row[column] : '-',
              column,
              row.ID,
              idx
            )
          )}
        </Table.Row>
      );
    });
  };

  render() {
    const { columns, rows, detailsURL } = this.props;

    return (
      <Table.Body>{this._renderRow(columns, rows, detailsURL)}</Table.Body>
    );
  }
}

ResultsTableBody.propTypes = {
  columns: PropTypes.array.isRequired,
  rowActionClickHandler: PropTypes.func,
};

ResultsTableBody.defaultProps = {
  rowActionClickHandler: null,
};
