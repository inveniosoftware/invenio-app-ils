import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Table } from 'semantic-ui-react';

export default class ResultsTableBody extends Component {
  renderCell = (cell, column, id, colIndex) => {
    return (
      <Table.Cell key={colIndex + '-' + id} data-test={column + '-' + id}>
        {cell}
      </Table.Cell>
    );
  };

  renderRow = (columns, rows) => {
    return rows.map(row => {
      const withRowAction = this.props.rowActionClickHandler ? (
        <Button
          circular
          compact
          icon="eye"
          onClick={() => {
            this.props.rowActionClickHandler(row);
          }}
          data-test={'btn-view-details-' + row.ID}
        />
      ) : null;

      return (
        <Table.Row key={row.ID} data-test={row.ID}>
          <Table.Cell textAlign="center">{withRowAction}</Table.Cell>
          {columns.map((column, idx) =>
            this.renderCell(
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

    return <Table.Body>{this.renderRow(columns, rows, detailsURL)}</Table.Body>;
  }
}

ResultsTableBody.propTypes = {
  columns: PropTypes.array.isRequired,
  rowActionClickHandler: PropTypes.func,
};

ResultsTableBody.defaultProps = {
  rowActionClickHandler: null,
};
