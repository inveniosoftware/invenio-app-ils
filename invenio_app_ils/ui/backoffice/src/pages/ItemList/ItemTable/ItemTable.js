import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Table } from 'semantic-ui-react';

class ItemTable extends Component {
  navToDetails(itemId) {
    this.props.history.push(`/backoffice/items/${itemId}`);
  }

  renderData(items) {
    return items.map(item => {
      let meta = item.metadata;
      return (
        <Table.Row
          key={meta.item_pid}
          onClick={() => this.navToDetails(meta.item_pid)}
        >
          <Table.Cell collapsing>{meta.barcode}</Table.Cell>
          <Table.Cell collapsing>{meta.status}</Table.Cell>
          <Table.Cell collapsing>{meta.item_pid}</Table.Cell>
        </Table.Row>
      );
    });
  }

  render() {
    let { data } = this.props;
    let items = data.hits.hits;
    return (
      <Table color={'black'} selectable celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Barcode</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Item PID</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{this.renderData(items)}</Table.Body>
      </Table>
    );
  }
}

export default withRouter(ItemTable);
