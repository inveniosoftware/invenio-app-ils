import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Table } from 'semantic-ui-react';

export class ItemMetadata extends Component {
  renderItemMetadata(data) {
    return Object.keys(data.metadata).map(key => {
      return (
        <Table.Row key={key}>
          <Table.Cell collapsing>{key}</Table.Cell>
          <Table.Cell>{JSON.stringify(data.metadata[key])}</Table.Cell>
        </Table.Row>
      );
    });
  }

  render() {
    let { data } = this.props;
    return (
      <div>
        <Header as="h1">Item Information</Header>
        <Table compact celled definition textAlign="center">
          <Table.Header fullWidth>
            <Table.Row>
              <Table.HeaderCell>Property</Table.HeaderCell>
              <Table.HeaderCell>Value</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{this.renderItemMetadata(data)}</Table.Body>
        </Table>
      </div>
    );
  }
}

ItemMetadata.propTypes = {
  data: PropTypes.object.isRequired,
};
