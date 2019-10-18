import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Table } from 'semantic-ui-react';
import _isFunction from 'lodash/isFunction';

export default class ResultsTableBody extends Component {
  renderCell = (cell, column, id, colIndex) => {
    return (
      <Table.Cell key={colIndex + '-' + id} data-test={column + '-' + id}>
        {cell}
      </Table.Cell>
    );
  };

  // This is wrong row.ID is something we create on prepare data, not data itself
  renderRow = (columns, rows) => {
    const { rowActionClickHandler } = this.props;

    return rows.map(row => {
      const withRowAction = _isFunction(rowActionClickHandler) ? (
        <Button
          compact
          icon="info"
          as={Link}
          to={rowActionClickHandler(row.ID, row.Type)}
          data-test={row.ID}
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
    const { columns, rows } = this.props;
    return <Table.Body>{this.renderRow(columns, rows)}</Table.Body>;
  }
}

ResultsTableBody.propTypes = {
  columns: PropTypes.array.isRequired,
  rowActionClickHandler: PropTypes.func,
};

ResultsTableBody.defaultProps = {
  rowActionClickHandler: null,
};
