import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

export default class ResultsTableHeader extends Component {
  render() {
    const { columns } = this.props;
    return (
      <Table.Header>
        <Table.Row data-test="header">
          <Table.HeaderCell />
          {columns.map(col => (
            <Table.HeaderCell key={col}>{col}</Table.HeaderCell>
          ))}
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
