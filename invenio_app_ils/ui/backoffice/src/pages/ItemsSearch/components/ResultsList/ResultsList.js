import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from 'semantic-ui-react';
import { fromISO, toString } from 'common/api/date';

class ItemRow extends Component {
  constructor(props) {
    super(props);
    this.viewDetailsClickHandler = props.viewDetailsClickHandler;
  }

  _getFormattedDate = d => (d ? toString(fromISO(d)) : '');

  render() {
    const itemRecord = this.props.itemRecord;
    const item = itemRecord.metadata;

    return (
      <Table.Row key={itemRecord.id} data-test={itemRecord.id}>
        <Table.Cell textAlign="center">
          <Button
            circular
            compact
            icon="eye"
            onClick={() => {
              this.viewDetailsClickHandler(itemRecord.id);
            }}
          />
        </Table.Cell>
        <Table.Cell>{item.barcode}</Table.Cell>
        <Table.Cell>{itemRecord.id}</Table.Cell>
        <Table.Cell>{item.document_pid}</Table.Cell>
        <Table.Cell data-test="mapped-status">{item.status}</Table.Cell>
        <Table.Cell>{item.internal_location.name}</Table.Cell>
        <Table.Cell>{this._getFormattedDate(itemRecord.created)}</Table.Cell>
        <Table.Cell>{this._getFormattedDate(itemRecord.updated)}</Table.Cell>
      </Table.Row>
    );
  }
}

export class ResultsList extends Component {
  constructor(props) {
    super(props);
    this.viewDetailsClickHandler = this.props.viewDetailsClickHandler;
  }

  render() {
    const { results } = this.props;
    const _results = results.map(itemRecord => (
      <ItemRow
        key={itemRecord.id}
        itemRecord={itemRecord}
        viewDetailsClickHandler={this.viewDetailsClickHandler}
      />
    ));
    return _results.length ? (
      <Table striped singleLine selectable>
        <Table.Header>
          <Table.Row data-test="header">
            <Table.HeaderCell collapsing />
            <Table.HeaderCell>Barcode</Table.HeaderCell>
            <Table.HeaderCell>Item PID</Table.HeaderCell>
            <Table.HeaderCell>Document PID</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Location</Table.HeaderCell>
            <Table.HeaderCell>Created</Table.HeaderCell>
            <Table.HeaderCell>Updated</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{_results}</Table.Body>
      </Table>
    ) : null;
  }
}

ResultsList.propTypes = {
  results: PropTypes.array.isRequired,
  viewDetailsClickHandler: PropTypes.func.isRequired,
};
