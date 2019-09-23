import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Table } from 'semantic-ui-react';
import isBoolean from 'lodash/isBoolean';
import isNumber from 'lodash/isNumber';

export default class ResultsTableBody extends Component {
  renderValue = value => {
    switch (true) {
      case isBoolean(value):
        return String(value);
      case isNumber(value):
        return value > 0 ? value : '-';
      default:
        return value;
    }
  };

  renderRowAction = row => {
    return this.props.rowActionClickHandler ? (
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
  };

  renderRows = (columns, rows) => {
    return rows.map(row => {
      return (
        <Table.Row key={row.ID} data-test={row.ID}>
          <Table.Cell textAlign="center">
            {this.renderRowAction(row)}
          </Table.Cell>

          {columns.map((column, idx) => (
            <Table.Cell
              key={`${idx}-${row.ID}`}
              data-test={`${column}-${row.ID}`}
            >
              {this.renderValue(row[column])}
            </Table.Cell>
          ))}
        </Table.Row>
      );
    });
  };

  render() {
    const { columns, rows } = this.props;
    return <Table.Body>{this.renderRows(columns, rows)}</Table.Body>;
  }
}

ResultsTableBody.propTypes = {
  columns: PropTypes.array.isRequired,
  rowActionClickHandler: PropTypes.func,
};

ResultsTableBody.defaultProps = {
  rowActionClickHandler: null,
};
