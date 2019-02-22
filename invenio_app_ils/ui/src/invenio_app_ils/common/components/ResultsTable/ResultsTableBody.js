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
    const RowActionComponent = this.props.rowActionComponent
      ? props =>
          React.cloneElement(this.props.rowActionComponent, {
            onClick: props.rowActionClickHandler,
          })
      : null;
    return rows.map(row => (
      <Table.Row key={row.ID} data-test={row.ID}>
        <Table.Cell key="details" textAlign="center">
          {this.props.rowActionComponent ? (
            <RowActionComponent
              rowActionClickHandler={() => {
                this.props.rowActionClickHandler(row.ID);
              }}
            />
          ) : (
            <Button
              circular
              compact
              icon="eye"
              onClick={() => {
                this.props.rowActionClickHandler(row.ID);
              }}
            />
          )}
        </Table.Cell>
        {columns.map((column, idx) =>
          this._renderCell(row[column] ? row[column] : '-', column, row.ID, idx)
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

ResultsTableBody.propTypes = {
  columns: PropTypes.array.isRequired,
  rowActionClickHandler: PropTypes.func.isRequired,
  rowActionComponent: PropTypes.node,
};

ResultsTableBody.defaultProps = {
  rowActionComponent: null,
};
