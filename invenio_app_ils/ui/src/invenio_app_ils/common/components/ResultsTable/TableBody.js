import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Table } from 'semantic-ui-react';

export default class TableBody extends Component {
  constructor(props) {
    super(props);
    this.detailsClickHandler = this.props.detailsClickHandler;
  }

  _renderCell = (cell, column, id) => {
    return <Table.Cell key={column + id}>{cell}</Table.Cell>;
  };

  _renderRow = (columns, rows) => {
    return rows.map(row => (
      <Table.Row key={row.ID} data-test={row.ID}>
        <Table.Cell key="details" textAlign="center">
          <Button
            circular
            compact
            icon="eye"
            onClick={() => {
              this.detailsClickHandler(row.ID);
            }}
          />
        </Table.Cell>
        {columns.map(column =>
          this._renderCell(row[column] ? row[column] : '-', column, row.ID)
        )}
      </Table.Row>
    ));
  };

  render() {
    const { columns, rows, detailsURL } = this.props;

    return (
      <Table.Body>{this._renderRow(columns, rows, detailsURL)}</Table.Body>
    );
  }
}

TableBody.propTypes = {
  columns: PropTypes.array.isRequired,
  detailsClickHandler: PropTypes.func.isRequired,
};
