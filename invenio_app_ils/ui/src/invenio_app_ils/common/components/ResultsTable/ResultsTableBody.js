import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Table } from 'semantic-ui-react';

export default class ResultsTableBody extends Component {
  constructor(props) {
    super(props);
    this.actionClickHandler = this.props.actionClickHandler;
  }

  _renderCell = (cell, column, id, col_index) => {
    return (
      <Table.Cell key={col_index + '-' + id} data-test={column + '-' + id}>
        {cell}
      </Table.Cell>
    );
  };

  _renderRow = (columns, rows) => {
    const RowActionComponent = this.props.actionComponent
      ? props =>
          React.cloneElement(this.props.actionComponent, {
            onClick: props.actionClickHandler,
          })
      : null;
    return rows.map(row => (
      <Table.Row key={row.ID} data-test={row.ID}>
        <Table.Cell key="details" textAlign="center">
          {this.props.actionComponent ? (
            <RowActionComponent
              actionClickHandler={() => {
                this.actionClickHandler(row.ID);
              }}
            />
          ) : (
            <Button
              circular
              compact
              icon="eye"
              onClick={() => {
                this.actionClickHandler(row.ID);
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
  actionClickHandler: PropTypes.func.isRequired,
};
