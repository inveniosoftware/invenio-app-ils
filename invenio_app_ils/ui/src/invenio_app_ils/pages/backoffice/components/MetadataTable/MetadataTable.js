import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export default class MetadataTable extends Component {
  _renderRows() {
    const labelWidth = this.props.labelWidth;
    const dataColWidth = this.props.dataColumnWidth;
    const entry = this.props.entry;

    return this.props.columns.map(column => (
      <Table.Row key={column.data_key}>
        <Table.Cell width={labelWidth}>{column.name}</Table.Cell>
        <Table.Cell width={dataColWidth}>{entry[column.data_key]}</Table.Cell>
      </Table.Row>
    ));
  }

  render() {
    return (
      <Table basic="very" definition className="metadata-table">
        <Table.Body>{this._renderRows()}</Table.Body>
      </Table>
    );
  }
}

MetadataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  entry: PropTypes.object.isRequired,
  labelWidth: PropTypes.number,
  dataColumnWidth: PropTypes.number,
};

MetadataTable.defaultProps = {
  labelWidth: 3,
  dataColumnWidth: 12,
};
