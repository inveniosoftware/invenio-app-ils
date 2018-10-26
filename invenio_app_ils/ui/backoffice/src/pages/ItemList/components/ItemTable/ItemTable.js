import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { URLS } from 'common/urls';

import './ItemTable.scss';

class ItemTable extends Component {
  navigateToDetails(itemId) {
    this.props.history.push(URLS.itemDetails(itemId));
  }

  renderData(items) {
    return items.map(item => {
      let meta = item.metadata;
      return (
        <Table.Row
          key={meta.item_pid}
          onClick={() => this.navigateToDetails(meta.item_pid)}
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
      <Table selectable celled className="item-table">
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
